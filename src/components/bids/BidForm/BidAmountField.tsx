import React from 'react';
import { BidAmountFieldProps } from './BidAmountFieldProps';

export const BidAmountField: React.FC<BidAmountFieldProps> = ({ 
  amount, 
  onChange,
  minPrice,
  maxPrice 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Your Offer</label>
      <input
        type="number"
        required
        min={minPrice}
        max={maxPrice}
        step="0.01"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        value={amount}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
};