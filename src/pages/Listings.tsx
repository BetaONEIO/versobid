import React from 'react';
import { ListingGrid } from '../components/listings/ListingGrid';
import { useListings } from '../hooks/useListings';

export const Listings: React.FC = () => {
  const { listings, loading, error } = useListings();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Items</h1>
      <ListingGrid listings={listings} />
    </div>
  );
};