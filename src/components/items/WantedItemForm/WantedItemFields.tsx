import React, { useState } from 'react';
import { ItemFormData } from '../../../types/item';
import { categories } from '../../../utils/constants';
import { ItemSuggestions } from './ItemSuggestions';

interface WantedItemFieldsProps {
  formData: ItemFormData;
  onChange: (field: keyof ItemFormData, value: string | number) => void;
}

export const WantedItemFields: React.FC<WantedItemFieldsProps> = ({ formData, onChange }) => {
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      onChange(field, numValue);
    }
  };

  const handleSuggestionSelect = (suggestion: { title: string; price?: number }) => {
    onChange('title', suggestion.title);
    if (suggestion.price) {
      const minPrice = Math.floor(suggestion.price * 0.8); // 20% below suggested price
      const maxPrice = Math.ceil(suggestion.price * 1.2); // 20% above suggested price
      onChange('minPrice', minPrice);
      onChange('maxPrice', maxPrice);
    }
    setShowSuggestions(false);
  };

  const conditions = ['new', 'like-new', 'good', 'fair', 'poor'] as const;

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
          onChange={(e) => {
            onChange('title', e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Start typing to see suggestions..."
        />
        {showSuggestions && (
          <ItemSuggestions
            searchTerm={formData.title}
            onSelect={handleSuggestionSelect}
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
          placeholder="Specify any additional requirements or preferences"
        />
      </div>

      <div>
        <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Minimum Condition Required
        </label>
        <select
          id="condition"
          value={formData.condition || 'good'}
          onChange={(e) => onChange('condition', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          {conditions.map((condition) => (
            <option key={condition} value={condition}>
              {condition.charAt(0).toUpperCase() + condition.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Minimum Price ($)
          </label>
          <input
            id="minPrice"
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.minPrice}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Maximum Price ($)
          </label>
          <input
            id="maxPrice"
            type="number"
            required
            min={formData.minPrice}
            step="0.01"
            value={formData.maxPrice}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
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