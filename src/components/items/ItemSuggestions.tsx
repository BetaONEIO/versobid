import React from 'react';
import { SearchResult } from '../../types/search';

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
        Loading suggestions...
      </div>
    );
  }

  if (!suggestions.length) {
    return null;
  }

  return (
    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg">
      <ul className="max-h-60 overflow-auto">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion.imageUrl && (
              <img
                src={suggestion.imageUrl}
                alt={suggestion.title}
                className="w-12 h-12 object-cover rounded mr-3"
              />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {suggestion.title}
              </div>
              {suggestion.price && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ${suggestion.price.toFixed(2)}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};