import React, { useState } from 'react';
import { ItemFormData } from '../../../types/item';
import { categories } from '../../../utils/constants';
import { useEbaySearch } from '../../../hooks/useEbaySearch';
import { ItemSuggestions } from '../ItemSuggestions';
import { PriceSuggestion } from './PriceSuggestion';

interface WantedItemFieldsProps {
  formData: ItemFormData;
  onChange: (field: keyof ItemFormData, value: string | number) => void;
}

export const WantedItemFields: React.FC<WantedItemFieldsProps> = ({ formData, onChange }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { loading, suggestions, priceAnalysis, searchItems } = useEbaySearch();

  const handleTitleChange = (value: string) => {
    onChange('title', value);
    if (value.length >= 3) {
      searchItems(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: any) => {
    onChange('title', suggestion.title);
    if (suggestion.price) {
      onChange('minPrice', suggestion.price * 0.8);
      onChange('maxPrice', suggestion.price * 1.2);
    }
    setShowSuggestions(false);
  };

  const handlePriceRangeAccept = (minPrice: number, maxPrice: number) => {
    onChange('minPrice', minPrice);
    onChange('maxPrice', maxPrice);
  };

  return (
    <div className="space-y-6">
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
          placeholder="Describe the item you want to buy"
        />
        {showSuggestions && (
          <ItemSuggestions
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
            loading={loading}
          />
        )}
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

      {priceAnalysis && (
        <PriceSuggestion
          priceAnalysis={priceAnalysis}
          onAcceptRange={handlePriceRangeAccept}
        />
      )}
    </div>
  );
};