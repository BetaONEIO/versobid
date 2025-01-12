import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/ui/SearchBar';
import { useListings } from '../hooks/useListings';
import { useUser } from '../contexts/UserContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const Listings: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const { listings, loading, error } = useListings();
  const { role } = useUser();

  useEffect(() => {
    if (searchQuery) {
      // Handle search query changes
      console.log('Search query changed:', searchQuery);
    }
  }, [searchQuery]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (role === 'buyer' && listings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            You've listed no items, yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>
      <h1 className="text-2xl font-bold mb-6">
        {searchQuery 
          ? `Search Results for "${searchQuery}"` 
          : role === 'buyer' 
            ? 'My Listings'
            : 'Current active items'}
      </h1>

      {role === 'buyer' ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Posted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {listing.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {listing.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatCurrency(listing.minPrice)} - {formatCurrency(listing.maxPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(listing.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {listing.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{listing.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                  {formatCurrency(listing.minPrice)} - {formatCurrency(listing.maxPrice)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {listing.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};