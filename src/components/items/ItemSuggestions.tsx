import React from 'react';
import { SearchResult } from '../../types/search';
import { formatCurrency } from '../../utils/formatters';

interface ItemSuggestionsProps {
  suggestions: SearchResult[];
  onSelect: (suggestion: SearchResult) => void;
  loading: boolean;
}

export const ItemSuggestions: React.FC<ItemSuggestionsProps> = ({
  suggestions,
  onSelect,
  loading
}) => {
  if (loading) {
    return (
      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg p-4">
        <div className="animate-pulse flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-300">Loading suggestions...</div>
        </div>
      </div>
    );
  }

  if (!suggestions.length) {
    return null;
  }

  return (
    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg">
      <ul className="max-h-60 overflow-auto divide-y divide-gray-200 dark:divide-gray-700">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion.imageUrl && (
              <div className="flex-shrink-0 w-16 h-16 mr-4">
                <img
                  src={suggestion.imageUrl}
                  alt={suggestion.title}
                  className="w-full h-full object-contain rounded"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex-grow min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {suggestion.title}
              </div>
              {suggestion.price !== undefined && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(suggestion.price)}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};