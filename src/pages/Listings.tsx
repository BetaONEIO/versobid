import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { ListingGrid } from '../components/listings/ListingGrid';
import { useListings } from '../hooks/useListings';

export const Listings: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useUser();
  const { listings, loading, error } = useListings();

  if (loading) {
    return <div className="text-center py-8">Loading listings...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {role === 'seller' ? 'My Listings' : 'Available Listings'}
        </h1>
        {role === 'seller' && (
          <button
            onClick={() => navigate('/listings/create')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create Listing
          </button>
        )}
      </div>
      <ListingGrid listings={listings} />
    </div>
  );
};