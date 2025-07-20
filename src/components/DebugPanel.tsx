import React from 'react';
import { Info, Target, Activity } from 'lucide-react';
import type { BodyTypeResult } from '../App';

interface DebugPanelProps {
  bodyTypeResult: BodyTypeResult;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ bodyTypeResult }) => {
  const { metrics, keypoints } = bodyTypeResult;

  const formatNumber = (num: number) => num.toFixed(3);

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-300 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-4 w-4 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-800">Debug Information</h3>
      </div>

      <div className="space-y-4 text-sm">
        {/* Body Measurements */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Target className="h-3 w-3" />
            Measured Proportions
          </h4>
          <div className="bg-white rounded p-3 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Shoulder Span:</span>
                <span className="font-mono ml-2">{formatNumber(metrics.shoulderSpan)}px</span>
              </div>
              <div>
                <span className="text-gray-600">Waist Span:</span>
                <span className="font-mono ml-2">{formatNumber(metrics.waistSpan)}px</span>
              </div>
              <div>
                <span className="text-gray-600">Hip Span:</span>
                <span className="font-mono ml-2">{formatNumber(metrics.hipSpan)}px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Ratios */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Activity className="h-3 w-3" />
            Classification Ratios
          </h4>
          <div className="bg-white rounded p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">r1 (Waist/Shoulder):</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">{formatNumber(metrics.r1WaistShoulder)}</span>
                <div className="w-16 h-2 bg-gray-200 rounded">
                  <div 
                    className="h-full bg-blue-500 rounded" 
                    style={{ width: `${Math.min(metrics.r1WaistShoulder * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">r2 (Hip/Shoulder):</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">{formatNumber(metrics.r2HipShoulder)}</span>
                <div className="w-16 h-2 bg-gray-200 rounded">
                  <div 
                    className="h-full bg-purple-500 rounded" 
                    style={{ width: `${Math.min(metrics.r2HipShoulder * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Classification Details */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Classification Result</h4>
          <div className="bg-white rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Body Type:</span>
              <span className="font-semibold capitalize text-purple-700">
                {bodyTypeResult.bodyType}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Confidence:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">{(bodyTypeResult.confidence * 100).toFixed(1)}%</span>
                <div className="w-16 h-2 bg-gray-200 rounded">
                  <div 
                    className="h-full bg-green-500 rounded" 
                    style={{ width: `${bodyTypeResult.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Keypoints Info */}
        {keypoints && keypoints.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Detected Keypoints</h4>
            <div className="bg-white rounded p-3">
              <p className="text-gray-600 mb-2">
                Detected {keypoints.length} pose landmarks
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto text-xs">
                {keypoints.slice(0, 8).map((kp, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-gray-500 truncate">{kp.name}:</span>
                    <span className="font-mono text-gray-700">
                      {kp.visibility?.toFixed(2) || '1.00'}
                    </span>
                  </div>
                ))}
                {keypoints.length > 8 && (
                  <div className="col-span-2 text-center text-gray-400">
                    ... and {keypoints.length - 8} more
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Body Type Categories */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Body Type Reference</h4>
          <div className="bg-white rounded p-3 space-y-2 text-xs">
            <div className="grid grid-cols-1 gap-2">
              {[
                { type: 'hourglass', desc: 'Balanced, defined waist (r1 < 0.75, r2 ≈ 1.0)' },
                { type: 'pear', desc: 'Larger hips (r2 > 1.1)' },
                { type: 'apple', desc: 'Fuller midsection (r1 > 0.85, r2 < 0.95)' },
                { type: 'rectangle', desc: 'Similar measurements (r1 ≈ 0.85, r2 ≈ 0.9)' },
                { type: 'inverted_triangle', desc: 'Broader shoulders (r2 < 0.85)' }
              ].map(({ type, desc }) => (
                <div 
                  key={type} 
                  className={`p-2 rounded ${
                    bodyTypeResult.bodyType === type 
                      ? 'bg-purple-100 border border-purple-300' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className={`font-medium capitalize ${
                      bodyTypeResult.bodyType === type ? 'text-purple-800' : 'text-gray-600'
                    }`}>
                      {type.replace('_', ' ')}
                    </span>
                    {bodyTypeResult.bodyType === type && (
                      <span className="text-purple-600 font-bold">✓</span>
                    )}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="text-xs text-gray-400 border-t pt-2">
          <p>
            * Measurements are in pixels relative to the uploaded image
          </p>
          <p>
            * Ratios are used for body type classification
          </p>
          <p>
            * Higher confidence indicates more certain classification
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
