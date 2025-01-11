import React, { useState } from 'react';
import { ItemFormData } from '../../../types/item';
import { categories } from '../../../utils/constants';
import { useEbaySearch } from '../../../hooks/useEbaySearch';
import { ItemSuggestions } from '../ItemSuggestions';

interface WantedItemFieldsProps {
  formData: ItemFormData;
  onChange: (field: keyof ItemFormData, value: string | number) => void;
}

export const WantedItemFields: React.FC<WantedItemFieldsProps> = ({ formData, onChange }) => {
  const { loading, suggestions, searchItems } = useEbaySearch();
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      onChange('minPrice', suggestion.price * 0.8); // Set min price to 80% of suggested price
      onChange('maxPrice', suggestion.price * 1.2); // Set max price to 120% of suggested price
    }
    setShowSuggestions(false);
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
          onFocus={() => formData.title.length >= 3 && setShowSuggestions(true)}
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
    </div>
  );
};