import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import type { DressRecommendation } from '../App';

interface RecommendationsProps {
  recommendations: DressRecommendation[];
  onDressSelect: (dressImage: string) => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations, onDressSelect }) => {
  const [selectedDress, setSelectedDress] = useState<string>('');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleDressSelect = (dress: DressRecommendation) => {
    setSelectedDress(dress.id);
    onDressSelect(dress.image);
  };

  const handleImageError = (dressId: string) => {
    setImageErrors(prev => new Set(prev).add(dressId));
  };

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500" />
        Recommended Dresses
      </h2>

      <div className="space-y-4">
        {recommendations.map((dress, index) => (
          <div
            key={dress.id}
            className={`p-4 border border-gray-200 rounded-lg cursor-pointer transition-all ${
              selectedDress === dress.id
                ? 'border-purple-500 bg-purple-50'
                : 'hover:border-gray-300 hover:shadow-sm'
            }`}
            onClick={() => handleDressSelect(dress)}
          >
            <div className="flex gap-4">
              {/* Dress Image */}
              <div className="flex-shrink-0">
                <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  {imageErrors.has(dress.id) ? (
                    <div 
                      className="w-full h-full flex items-center justify-center text-xs text-gray-500 bg-gradient-to-br from-purple-100 to-pink-100"
                      title="Dress placeholder"
                    >
                      <div className="text-center">
                        <div className="w-8 h-10 bg-purple-300 rounded mx-auto mb-1"></div>
                        <span>Dress {index + 1}</span>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={dress.image}
                      alt={dress.title}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(dress.id)}
                      loading="lazy"
                    />
                  )}
                </div>
              </div>

              {/* Dress Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {dress.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {dress.reason}
                </p>
                
                {/* Rating placeholder */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">4.0 (120)</span>
                </div>
              </div>

              {/* Selection indicator */}
              {selectedDress === dress.id && (
                <div className="flex-shrink-0 flex items-center">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <Heart className="h-3 w-3 text-white fill-current" />
                  </div>
                </div>
              )}
            </div>

            {/* Try On Button */}
            {selectedDress === dress.id && (
              <div className="mt-3 pt-3 border-t border-purple-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-700 font-medium">
                    Selected for Try-On
                  </span>
                  <button className="text-xs text-purple-600 hover:text-purple-800">
                    View Details
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          💡 Styling Tips
        </h4>
        <p className="text-sm text-blue-700">
          Click on any dress to see how it looks on you! The overlay feature helps you visualize the fit and style before making a decision.
        </p>
      </div>

      {/* Size Guide Link */}
      <div className="mt-3 text-center">
        <button className="text-sm text-gray-500 hover:text-gray-700 underline">
          View Size Guide
        </button>
      </div>
    </div>
  );
};

export default Recommendations;
