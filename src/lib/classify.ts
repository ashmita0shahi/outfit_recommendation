// Body type classification using loaded model or fallback rules

interface ClassificationResult {
  bodyType: string;
  confidence: number;
}

interface CoefficientData {
  model_type: string;
  labels: string[];
  coefficients: number[][];
  intercept: number[];
  feature_names: string[];
  accuracy: number;
}

let coefficientsData: CoefficientData | null = null;
let tfModel: any = null; // TensorFlow.js model

// Load coefficients from JSON file
async function loadCoefficients(): Promise<CoefficientData | null> {
  if (coefficientsData) return coefficientsData;

  try {
    const response = await fetch('/model/coefficients.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    coefficientsData = await response.json();
    console.log('Coefficients loaded successfully');
    return coefficientsData;
  } catch (error) {
    console.warn('Failed to load coefficients:', error);
    return null;
  }
}

// Load TensorFlow.js model
async function loadTensorFlowModel() {
  if (tfModel) return tfModel;

  try {
    // First try to import TensorFlow.js
    const tf = await import('@tensorflow/tfjs');
    
    tfModel = await tf.loadLayersModel('/model/tfjs_model/model.json');
    console.log('TensorFlow.js model loaded successfully');
    return tfModel;
  } catch (error) {
    console.warn('Failed to load TensorFlow.js model:', error);
    return null;
  }
}

// Predict using loaded coefficients
function predictWithCoefficients(r1: number, r2: number, data: CoefficientData): ClassificationResult {
  try {
    const features = [r1, r2];
    const coefficients = data.coefficients;
    const intercept = data.intercept;
    const labels = data.labels;

    // Calculate scores for each class (multiclass logistic regression)
    const scores = coefficients.map((classCoeff, classIdx) => {
      const score = classCoeff.reduce((sum, coeff, featIdx) => {
        return sum + (coeff * features[featIdx]);
      }, intercept[classIdx]);
      return score;
    });

    // Apply softmax to get probabilities
    const maxScore = Math.max(...scores);
    const expScores = scores.map(score => Math.exp(score - maxScore));
    const sumExp = expScores.reduce((sum, exp) => sum + exp, 0);
    const probabilities = expScores.map(exp => exp / sumExp);

    // Find the class with highest probability
    const maxIdx = probabilities.indexOf(Math.max(...probabilities));
    const bodyType = labels[maxIdx];
    const confidence = probabilities[maxIdx];

    return { bodyType, confidence };
  } catch (error) {
    console.error('Prediction with coefficients failed:', error);
    throw error;
  }
}

// Predict using TensorFlow.js model
async function predictWithTensorFlow(r1: number, r2: number, model: any): Promise<ClassificationResult> {
  try {
    const tf = await import('@tensorflow/tfjs');
    
    // Load metadata to get labels
    const metadataResponse = await fetch('/model/tfjs_metadata.json');
    const metadata = await metadataResponse.json();
    
    // Prepare input tensor
    const inputTensor = tf.tensor2d([[r1, r2]]);
    
    // Make prediction
    const predictions = model.predict(inputTensor) as any;
    const probabilities = await predictions.data();
    
    // Find the class with highest probability
    const maxIdx = probabilities.indexOf(Math.max(...probabilities));
    const bodyType = metadata.labels[maxIdx];
    const confidence = probabilities[maxIdx];

    // Clean up tensors
    inputTensor.dispose();
    predictions.dispose();

    return { bodyType, confidence };
  } catch (error) {
    console.error('TensorFlow prediction failed:', error);
    throw error;
  }
}

// Fallback rule-based classification
function classifyWithRules(r1: number, r2: number): ClassificationResult {
  console.warn('Using fallback rule-based classification');

  // Rule-based classification based on typical body proportions
  // r1 = waist/shoulder, r2 = hip/shoulder
  
  let bodyType = 'rectangle';
  let confidence = 0.7;

  if (r1 < 0.75 && Math.abs(r2 - 1.0) < 0.1) {
    // Small waist, hips similar to shoulders
    bodyType = 'hourglass';
    confidence = 0.8;
  } else if (r2 > 1.1) {
    // Hips significantly larger than shoulders
    bodyType = 'pear';
    confidence = 0.75;
  } else if (r1 > 0.85 && r2 < 0.95) {
    // Less defined waist, smaller hips
    bodyType = 'apple';
    confidence = 0.7;
  } else if (r2 < 0.85) {
    // Hips smaller than shoulders
    bodyType = 'inverted_triangle';
    confidence = 0.75;
  }
  // Default case is rectangle (similar measurements throughout)

  return { bodyType, confidence };
}

export async function classifyBodyType(r1WaistShoulder: number, r2HipShoulder: number): Promise<ClassificationResult> {
  // Clamp values to reasonable ranges
  const r1 = Math.max(0.6, Math.min(1.0, r1WaistShoulder));
  const r2 = Math.max(0.7, Math.min(1.3, r2HipShoulder));

  console.log(`Classifying body type with ratios: r1=${r1.toFixed(3)}, r2=${r2.toFixed(3)}`);

  // Try TensorFlow.js model first
  try {
    const model = await loadTensorFlowModel();
    if (model) {
      const result = await predictWithTensorFlow(r1, r2, model);
      console.log(`TensorFlow prediction: ${result.bodyType} (${(result.confidence * 100).toFixed(1)}%)`);
      return result;
    }
  } catch (error) {
    console.warn('TensorFlow classification failed, trying coefficients:', error);
  }

  // Try coefficients model
  try {
    const coefficients = await loadCoefficients();
    if (coefficients) {
      const result = predictWithCoefficients(r1, r2, coefficients);
      console.log(`Coefficients prediction: ${result.bodyType} (${(result.confidence * 100).toFixed(1)}%)`);
      return result;
    }
  } catch (error) {
    console.warn('Coefficients classification failed, using rules:', error);
  }

  // Fallback to rule-based classification
  const result = classifyWithRules(r1, r2);
  console.log(`Rule-based prediction: ${result.bodyType} (${(result.confidence * 100).toFixed(1)}%)`);
  return result;
}

// Get body type descriptions
export function getBodyTypeDescription(bodyType: string): string {
  const descriptions: { [key: string]: string } = {
    hourglass: 'Balanced proportions with a defined waist, similar shoulder and hip measurements',
    pear: 'Hips are wider than shoulders, with a smaller upper body',
    apple: 'Fuller midsection with less defined waist, broader shoulders',
    rectangle: 'Similar measurements throughout, straight silhouette',
    inverted_triangle: 'Broader shoulders than hips, athletic build'
  };

  return descriptions[bodyType] || 'Unknown body type';
}

// Get style recommendations for each body type
export function getStyleTips(bodyType: string): string[] {
  const tips: { [key: string]: string[] } = {
    hourglass: [
      'Emphasize your waist with belts or fitted styles',
      'Choose wrap dresses or fit-and-flare silhouettes',
      'V-necks and sweetheart necklines are flattering',
      'Avoid boxy or oversized clothing that hides your curves'
    ],
    pear: [
      'Balance your proportions with structured shoulders',
      'Choose A-line and fit-and-flare dresses',
      'Emphasize your upper body with interesting necklines',
      'Avoid clingy fabrics around the hip area'
    ],
    apple: [
      'Create a defined waist with empire waistlines',
      'Choose dresses with gentle draping and vertical lines',
      'Deeper necklines help elongate your torso',
      'Avoid tight-fitting clothes around the midsection'
    ],
    rectangle: [
      'Create curves with belted styles and peplum details',
      'Choose dresses with darts or seaming for shape',
      'Layer to add visual interest and dimension',
      'Avoid straight, boxy silhouettes'
    ],
    inverted_triangle: [
      'Balance your silhouette with A-line skirts',
      'Choose V-necks to soften your shoulder line',
      'Add volume to your lower half with pleats or ruffles',
      'Avoid shoulder pads or embellishments at the shoulder'
    ]
  };

  return tips[bodyType] || ['Consult with a stylist for personalized advice'];
}
