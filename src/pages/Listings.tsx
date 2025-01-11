import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ListingGrid } from '../components/listings/ListingGrid';
import { SearchBar } from '../components/ui/SearchBar';
import { useListings } from '../hooks/useListings';

export const Listings: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const { listings, loading, error, searchListings } = useListings();

  useEffect(() => {
    if (searchQuery) {
      searchListings(searchQuery);
    }
  }, [searchQuery]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>
      <h1 className="text-2xl font-bold mb-6">
        {searchQuery ? `Search Results for "${searchQuery}"` : 'Available Items'}
      </h1>
      <ListingGrid listings={listings} />
    </div>
  );
};