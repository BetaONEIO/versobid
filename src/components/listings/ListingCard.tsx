import React from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../../types/item';
import { formatCurrency } from '../../utils/formatters';

interface ListingCardProps {
  listing: Item;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <Link to={`/listings/${listing.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {listing.description}
          </p>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Budget:</span>
              <span className="ml-2 text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(listing.minPrice)} - {formatCurrency(listing.maxPrice)}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {listing.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};