import { useState, useRef } from 'react';
import { Camera, RotateCcw, AlertCircle } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import AnalyzerCanvas from './components/AnalyzerCanvas';
import Recommendations from './components/Recommendations';
import ResultActions from './components/ResultActions';
import DebugPanel from './components/DebugPanel';

export interface BodyTypeResult {
  bodyType: string;
  confidence: number;
  metrics: {
    shoulderSpan: number;
    waistSpan: number;
    hipSpan: number;
    r1WaistShoulder: number;
    r2HipShoulder: number;
  };
  keypoints?: any[];
}

export interface DressRecommendation {
  id: string;
  title: string;
  reason: string;
  image: string;
}

function App() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [bodyTypeResult, setBodyTypeResult] = useState<BodyTypeResult | null>(null);
  const [recommendations, setRecommendations] = useState<DressRecommendation[]>([]);
  const [error, setError] = useState<string>('');
  const [showDebug, setShowDebug] = useState(false);
  const [tryOnEnabled, setTryOnEnabled] = useState(true);
  const [selectedDressImage, setSelectedDressImage] = useState<string>('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (file: File) => {
    setError('');
    setUploadedImage(file);
    setBodyTypeResult(null);
    setRecommendations([]);
    setSelectedDressImage(''); // Clear selected dress
    
    // Create URL for display
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleAnalysisComplete = (result: BodyTypeResult, recs: DressRecommendation[]) => {
    setBodyTypeResult(result);
    setRecommendations(recs);
    setSelectedDressImage(recs.length > 0 ? recs[0].image : ''); // Auto-select first dress
    setIsAnalyzing(false);
  };

  const handleDressSelect = (dressImage: string) => {
    setSelectedDressImage(dressImage);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setImageUrl('');
    setBodyTypeResult(null);
    setRecommendations([]);
    setError('');
    setIsAnalyzing(false);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
  };

  const handleAnalyze = () => {
    if (uploadedImage) {
      setIsAnalyzing(true);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI Dress Recommendation
          </h1>
          <p className="text-gray-600 text-lg">
            Upload your photo and get personalized dress recommendations based on your body type
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Upload and Analysis */}
          <div className="space-y-6">
            <ImageUploader
              onImageUpload={handleImageUpload}
              isAnalyzing={isAnalyzing}
            />

            {imageUrl && (
              <AnalyzerCanvas
                ref={canvasRef}
                imageUrl={imageUrl}
                isAnalyzing={isAnalyzing}
                onAnalysisComplete={handleAnalysisComplete}
                onError={handleError}
                tryOnEnabled={tryOnEnabled}
                selectedDress={selectedDressImage}
                startAnalysis={isAnalyzing}
              />
            )}

            {/* Controls */}
            {imageUrl && !isAnalyzing && !bodyTypeResult && (
              <div className="flex gap-4">
                <button
                  onClick={handleAnalyze}
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Camera className="h-5 w-5" />
                  Analyze Body Type
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            )}

            {/* Try-On Toggle */}
            {bodyTypeResult && (
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  Overlay dress on photo
                </span>
                <button
                  onClick={() => setTryOnEnabled(!tryOnEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    tryOnEnabled ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      tryOnEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {bodyTypeResult && (
              <>
                {/* Body Type Results */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Your Body Type Analysis
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-purple-800 capitalize">
                        {bodyTypeResult.bodyType}
                      </h3>
                      <p className="text-sm text-purple-600">
                        Confidence: {(bodyTypeResult.confidence * 100).toFixed(1)}%
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Waist/Shoulder:</span>
                        <span className="font-medium ml-2">
                          {bodyTypeResult.metrics.r1WaistShoulder.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Hip/Shoulder:</span>
                        <span className="font-medium ml-2">
                          {bodyTypeResult.metrics.r2HipShoulder.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Debug Panel Toggle */}
                  <button
                    onClick={() => setShowDebug(!showDebug)}
                    className="mt-4 text-sm text-purple-600 hover:text-purple-800"
                  >
                    {showDebug ? 'Hide' : 'Show'} Debug Info
                  </button>
                </div>

                {/* Debug Panel */}
                {showDebug && (
                  <DebugPanel
                    bodyTypeResult={bodyTypeResult}
                  />
                )}

                {/* Recommendations */}
                <Recommendations
                  recommendations={recommendations}
                  onDressSelect={handleDressSelect}
                />

                {/* Action Buttons */}
                <ResultActions
                  canvasRef={canvasRef}
                  onReset={handleReset}
                />
              </>
            )}

            {isAnalyzing && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">
                  Analyzing your body type...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
