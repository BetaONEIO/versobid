import React from 'react';
import { useParams } from 'react-router-dom';
import { useListing } from '../hooks/useListing';
import { BidForm } from '../components/bids/BidForm';
import { useUser } from '../contexts/UserContext';
import { formatCurrency } from '../utils/formatters';

export const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { listing, loading, error } = useListing(id!);
  const { role, auth } = useUser();

  if (loading) {
    return <div className="text-center py-8">Loading listing details...</div>;
  }

  if (error || !listing) {
    return <div className="text-center text-red-600 py-8">{error || 'Listing not found'}</div>;
  }

  const isOwner = auth.user?.id === listing.seller_id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {listing.description}
            </p>
            <div className="mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Budget:</span>
              <span className="ml-2 text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(listing.minPrice)} - {formatCurrency(listing.maxPrice)}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-gray-500 dark:text-gray-400">
                Category: {listing.category}
              </span>
            </div>
            {isOwner && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-md">
                <p className="text-yellow-800 dark:text-yellow-200">
                  This is your listing. You cannot bid on your own items.
                </p>
              </div>
            )}
          </div>
          {role === 'buyer' && !isOwner && auth.isAuthenticated && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Place a Bid</h2>
              <BidForm item={listing} onBidSubmitted={() => {}} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};