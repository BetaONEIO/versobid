import React, { useState } from 'react';
import { ItemFormData } from '../../../types/item';
import { categories } from '../../../utils/constants';
import { googleShoppingService } from '../../../services/shopping/googleShoppingService';
import { SearchResult } from '../../../types/search';

interface WantedItemFieldsProps {
  formData: ItemFormData;
  onChange: (field: keyof ItemFormData, value: string | number | any[]) => void;
}

export const WantedItemFields: React.FC<WantedItemFieldsProps> = ({ formData, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [priceAnalysis, setPriceAnalysis] = useState<any>(null);

  const handleTitleChange = async (value: string) => {
    onChange('title', value);
    if (value.length >= 3) {
      setLoading(true);
      try {
        const results = await googleShoppingService.searchProducts(value);
        setSuggestions(results.results || []);
        setPriceAnalysis(results.priceAnalysis);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: SearchResult) => {
    onChange('title', suggestion.title);
    if (suggestion.price) {
      const price = suggestion.price;
      onChange('minPrice', Math.floor(price * 0.9));
      onChange('maxPrice', Math.ceil(price * 1.1));
    }
    if (suggestion.shortDescription) {
      onChange('description', suggestion.shortDescription);
    }
    setShowSuggestions(false);
  };

  return (
    <>
      <div className="relative">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          What are you looking for?
        </label>
        <input
          id="title"
          type="text"
          required
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Start typing to see suggestions..."
        />
        {loading && (
          <div className="absolute right-3 top-9">
            <div className="animate-spin h-5 w-5 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
          </div>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg">
            <ul className="max-h-60 overflow-auto divide-y divide-gray-200 dark:divide-gray-700">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <div className="flex items-start space-x-4">
                    {suggestion.imageUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={suggestion.imageUrl}
                          alt={suggestion.title}
                          className="w-16 h-16 object-contain rounded bg-white"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                        {suggestion.title}
                      </p>
                      {suggestion.price !== undefined && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          £{suggestion.price.toFixed(2)}
                        </p>
                      )}
                      {suggestion.brand && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Brand: {suggestion.brand}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Additional Details
        </label>
        <textarea
          id="description"
          rows={4}
          required
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Specify condition, brand preferences, or any other requirements"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          id="category"
          required
          value={formData.category}
          onChange={(e) => onChange('category', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {priceAnalysis && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Market Price Analysis</h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Suggested price range: £{priceAnalysis.suggestedRange.minPrice} - £{priceAnalysis.suggestedRange.maxPrice}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Based on {priceAnalysis.basedOn} similar items
          </p>
        </div>
      )}
    </>
  );
};