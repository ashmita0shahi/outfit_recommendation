import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { detectPose } from '../lib/pose';
import { classifyBodyType } from '../lib/classify';
import { overlayDress } from '../lib/overlay';
import { generateRecommendations } from '../lib/recommendations';
import type { BodyTypeResult, DressRecommendation } from '../App';

interface AnalyzerCanvasProps {
  imageUrl: string;
  isAnalyzing: boolean;
  onAnalysisComplete: (result: BodyTypeResult, recommendations: DressRecommendation[]) => void;
  onError: (error: string) => void;
  tryOnEnabled: boolean;
  selectedDress?: string;
  startAnalysis: boolean;
}

const AnalyzerCanvas = forwardRef<HTMLCanvasElement, AnalyzerCanvasProps>(({
  imageUrl,
  isAnalyzing,
  onAnalysisComplete,
  onError,
  tryOnEnabled,
  selectedDress,
  startAnalysis
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [showKeypoints, setShowKeypoints] = useState(false);
  const [currentKeypoints, setCurrentKeypoints] = useState<any[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<any>(null);
  
  useImperativeHandle(ref, () => canvasRef.current!, []);

  const performAnalysis = async () => {
    if (!canvasRef.current || !imageRef.current) {
      onError('Canvas or image not ready');
      return;
    }

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        onError('Could not get canvas context');
        return;
      }

      // Set canvas size to match image
      const img = imageRef.current;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // Detect pose
      const keypoints = await detectPose(canvas);
      if (!keypoints || keypoints.length === 0) {
        onError('Could not detect pose. Please use a clear front-facing photo with good lighting.');
        return;
      }

      setCurrentKeypoints(keypoints);

      // Calculate body metrics from keypoints
      const metrics = calculateBodyMetrics(keypoints);
      if (!metrics) {
        onError('Could not calculate body measurements from the image.');
        return;
      }

      // Store metrics for dress overlay
      setCurrentMetrics(metrics);

      // Classify body type
      const classification = await classifyBodyType(metrics.r1WaistShoulder, metrics.r2HipShoulder);
      
      const result: BodyTypeResult = {
        bodyType: classification.bodyType,
        confidence: classification.confidence,
        metrics: metrics,
        keypoints: keypoints
      };

      // Generate recommendations
      const recommendations = generateRecommendations(result.bodyType);

      // If try-on is enabled and we have a dress, overlay it
      if (tryOnEnabled && recommendations.length > 0) {
        try {
          await overlayDress(canvas, keypoints, recommendations[0].image, metrics);
        } catch (overlayError) {
          console.warn('Dress overlay failed, showing dress separately:', overlayError);
          // Continue without overlay - not a fatal error
        }
      }

      onAnalysisComplete(result, recommendations);
    } catch (error) {
      console.error('Analysis failed:', error);
      onError(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const calculateBodyMetrics = (keypoints: any[]) => {
    try {
      // Find key landmarks
      const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
      const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
      const leftHip = keypoints.find(kp => kp.name === 'left_hip');
      const rightHip = keypoints.find(kp => kp.name === 'right_hip');

      if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
        throw new Error('Required keypoints not detected');
      }

      // Calculate spans
      const shoulderSpan = Math.abs(rightShoulder.x - leftShoulder.x);
      const hipSpan = Math.abs(rightHip.x - leftHip.x);
      
      // Estimate waist span (approximation between shoulder and hip)
      const waistSpan = shoulderSpan * 0.8; // Simple approximation
      
      // Calculate ratios
      const r1WaistShoulder = waistSpan / shoulderSpan;
      const r2HipShoulder = hipSpan / shoulderSpan;

      return {
        shoulderSpan,
        waistSpan,
        hipSpan,
        r1WaistShoulder,
        r2HipShoulder
      };
    } catch (error) {
      console.error('Error calculating body metrics:', error);
      return null;
    }
  };

  const redrawCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and redraw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0);

    // Draw keypoints if enabled
    if (showKeypoints && currentKeypoints.length > 0) {
      drawKeypoints(ctx, currentKeypoints);
    }
  };

  const drawKeypoints = (ctx: CanvasRenderingContext2D, keypoints: any[]) => {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;

    // Draw keypoints as circles
    keypoints.forEach(keypoint => {
      if (keypoint.visibility > 0.5) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Draw skeleton connections
    const connections = [
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip']
    ];

    connections.forEach(([startName, endName]) => {
      const start = keypoints.find(kp => kp.name === startName);
      const end = keypoints.find(kp => kp.name === endName);
      
      if (start && end && start.visibility > 0.5 && end.visibility > 0.5) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    if (startAnalysis && !isAnalyzing) {
      // This effect will trigger when startAnalysis becomes true
      return;
    }
    
    if (isAnalyzing && imageRef.current?.complete) {
      performAnalysis();
    }
  }, [isAnalyzing, startAnalysis]);

  useEffect(() => {
    redrawCanvas();
  }, [showKeypoints, currentKeypoints]);

  // Handle dress overlay updates
  useEffect(() => {
    if (tryOnEnabled && selectedDress && currentKeypoints.length > 0 && currentMetrics && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Redraw the original image first
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageRef.current, 0, 0);

      // Draw keypoints if enabled
      if (showKeypoints) {
        drawKeypoints(ctx, currentKeypoints);
      }

      // Apply dress overlay
      overlayDress(canvas, currentKeypoints, selectedDress, currentMetrics)
        .catch(error => {
          console.warn('Failed to overlay dress:', error);
        });
    } else if (!tryOnEnabled) {
      // If try-on is disabled, just redraw without overlay
      redrawCanvas();
    }
  }, [selectedDress, tryOnEnabled, currentKeypoints, currentMetrics, showKeypoints]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Image Analysis</h3>
        
        {currentKeypoints.length > 0 && (
          <button
            onClick={() => setShowKeypoints(!showKeypoints)}
            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {showKeypoints ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showKeypoints ? 'Hide' : 'Show'} Keypoints
          </button>
        )}
      </div>

      <div className="relative">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Uploaded"
          className="hidden" // Hidden image for canvas reference
          onLoad={() => {
            if (canvasRef.current && imageRef.current) {
              const canvas = canvasRef.current;
              const img = imageRef.current;
              
              // Set display size (responsive)
              const maxWidth = 500;
              const maxHeight = 600;
              const aspectRatio = img.naturalWidth / img.naturalHeight;
              
              let displayWidth = img.naturalWidth;
              let displayHeight = img.naturalHeight;
              
              if (displayWidth > maxWidth) {
                displayWidth = maxWidth;
                displayHeight = displayWidth / aspectRatio;
              }
              
              if (displayHeight > maxHeight) {
                displayHeight = maxHeight;
                displayWidth = displayHeight * aspectRatio;
              }

              // Set internal canvas size to actual image size
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              
              // Set display size
              canvas.style.width = `${displayWidth}px`;
              canvas.style.height = `${displayHeight}px`;

              // Draw initial image
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0);
              }
            }
          }}
        />
        
        <canvas
          ref={canvasRef}
          className="border border-gray-300 rounded-lg max-w-full h-auto"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm">Analyzing pose...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

AnalyzerCanvas.displayName = 'AnalyzerCanvas';

export default AnalyzerCanvas;
