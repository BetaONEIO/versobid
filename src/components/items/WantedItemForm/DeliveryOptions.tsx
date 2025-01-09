import React from 'react';
import { ShippingOption, ShippingType, PickupLocation } from '../../../types/item';

interface DeliveryOptionsProps {
  options: ShippingOption[];
  onChange: (options: ShippingOption[]) => void;
}

const distanceOptions = [5, 10, 15, 20, 25, 30, 50];

export const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({ options, onChange }) => {
  const addOption = (type: ShippingType) => {
    const newOption: ShippingOption = {
      type,
      location: type !== 'shipping' ? {
        postcode: '',
        town: '',
        maxDistance: type === 'seller-pickup' ? 15 : undefined
      } : undefined
    };
    
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

  const updateLocation = (index: number, field: keyof PickupLocation, value: string | number) => {
    const newOptions = [...options];
    if (!newOptions[index].location) {
      newOptions[index].location = { postcode: '', town: '' };
    }
    newOptions[index].location = {
      ...newOptions[index].location!,
      [field]: value
    };
    onChange(newOptions);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Delivery Preferences</h3>
      
      {options.map((option, index) => (
        <div key={index} className="flex items-start space-x-4 p-4 border rounded-md dark:border-gray-700">
          <div className="flex-grow space-y-4">
            {option.type === 'shipping' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Maximum Shipping Cost ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={option.cost || ''}
                  onChange={(e) => updateOption(index, { cost: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            ) : option.type === 'seller-dropoff' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Address
                  </label>
                  <textarea
                    value={option.location?.address || ''}
                    onChange={(e) => updateLocation(index, 'address', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Enter your full address"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Postcode
                    </label>
                    <input
                      type="text"
                      value={option.location?.postcode || ''}
                      onChange={(e) => updateLocation(index, 'postcode', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Town
                    </label>
                    <input
                      type="text"
                      value={option.location?.town || ''}
                      onChange={(e) => updateLocation(index, 'town', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maximum Travel Distance
                  </label>
                  <select
                    value={option.location?.maxDistance || 15}
                    onChange={(e) => updateLocation(index, 'maxDistance', Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    {distanceOptions.map(distance => (
                      <option key={distance} value={distance}>
                        {distance} miles
                      </option>
                    ))}
                  </select>
                </div>
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

      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => addOption('shipping')}
          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
        >
          Add Shipping Option
        </button>
        <button
          type="button"
          onClick={() => addOption('seller-dropoff')}
          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
        >
          Add Seller Drop-off
        </button>
        <button
          type="button"
          onClick={() => addOption('seller-pickup')}
          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
        >
          Add Seller Pick-up
        </button>
      </div>
    </div>
  );
};