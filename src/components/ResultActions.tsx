import React from 'react';
import { Download, RotateCcw, Share2 } from 'lucide-react';
import { downloadCanvasImage } from '../lib/overlay';

interface ResultActionsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onReset: () => void;
}

const ResultActions: React.FC<ResultActionsProps> = ({ canvasRef, onReset }) => {
  const handleDownload = () => {
    if (canvasRef.current) {
      downloadCanvasImage(canvasRef.current, 'my-dress-recommendation.png');
    }
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        canvasRef.current.toBlob(async (blob) => {
          if (!blob) return;
          
          const file = new File([blob], 'my-dress-look.png', { type: 'image/png' });
          
          try {
            await navigator.share({
              title: 'My Dress Recommendation',
              text: 'Check out this dress recommendation I got!',
              files: [file]
            });
          } catch (err) {
            console.log('Share cancelled or failed');
          }
        });
      } else {
        // Fallback to copying image URL
        canvasRef.current.toBlob((blob) => {
          if (!blob) return;
          
          const url = URL.createObjectURL(blob);
          
          // Try to copy URL to clipboard
          navigator.clipboard.writeText(url).then(() => {
            alert('Image URL copied to clipboard!');
          }).catch(() => {
            alert('Sharing not supported. Use the download button instead.');
          });
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
      alert('Sharing failed. Use the download button instead.');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Save & Share Your Look
      </h3>

      <div className="space-y-3">
        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Download className="h-4 w-4" />
          Download Image
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Share2 className="h-4 w-4" />
          Share Look
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <RotateCcw className="h-4 w-4" />
          Try Another Photo
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          🎨 Your Style Profile
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Analysis is based on body proportions</li>
          <li>• Try different poses for varied results</li>
          <li>• All processing is done locally for privacy</li>
        </ul>
      </div>

      {/* Save to Favorites (Placeholder) */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center mb-2">
          Want to save your preferences?
        </p>
        <button
          disabled
          className="w-full bg-gray-200 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed text-sm"
          title="Feature coming soon"
        >
          Save to My Profile (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default ResultActions;
