import React from 'react';
import { ShippingOption } from '../../../types/item';

interface DeliveryOptionsProps {
  options: ShippingOption[];
  onChange: (options: ShippingOption[]) => void;
}

export const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({ options, onChange }) => {
  const addOption = (type: 'shipping' | 'pickup') => {
    const newOption: ShippingOption = type === 'shipping' 
      ? { type: 'shipping', cost: 0 }
      : { type: 'pickup', location: '' };
    
    onChange([...options, newOption]);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    onChange(newOptions);
  };

  const updateOption = (index: number, updates: Partial<ShippingOption>) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], ...updates };
    onChange(newOptions);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Delivery Preferences</h3>
      
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 border rounded-md dark:border-gray-700">
          <div className="flex-grow">
            {option.type === 'shipping' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Maximum Shipping Cost ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={option.cost}
                  onChange={(e) => updateOption(index, { cost: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Pickup Location
                </label>
                <input
                  type="text"
                  value={option.location}
                  onChange={(e) => updateOption(index, { location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter city or area"
                />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeOption(index)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => addOption('shipping')}
          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
        >
          Add Shipping Option
        </button>
        <button
          type="button"
          onClick={() => addOption('pickup')}
          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
        >
          Add Pickup Location
        </button>
      </div>
    </div>
  );
};