import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatters';
import { ItemCardProps } from './types';

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <Link to={`/listings/${item.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {item.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(item.minPrice)} - {formatCurrency(item.maxPrice)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {item.category}
          </span>
        </div>
      </div>
    </Link>
  );
};