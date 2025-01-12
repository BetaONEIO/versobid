import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SearchBar } from '../components/ui/SearchBar';
import { useListings } from '../hooks/useListings';
import { useUser } from '../contexts/UserContext';
import { formatCurrency, formatDate } from '../utils/formatters';

type SortField = 'date' | 'price' | 'bids';
type SortOrder = 'asc' | 'desc';

export const Listings: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const { listings, loading, error } = useListings();
  const { role } = useUser();
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    if (searchQuery) {
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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            No Items Listed Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start by listing an item you're looking to buy. Sellers will be able to see your listing and make offers.
          </p>
          <Link
            to="/items/add"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            List an Item
          </Link>
        </div>
      </div>
    );
  }

  const filteredListings = listings
    .filter(listing => statusFilter === 'all' || listing.status === statusFilter)
    .filter(listing => categoryFilter === 'all' || listing.category === categoryFilter);

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortField) {
      case 'date':
        return sortOrder === 'desc' 
          ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'price':
        return sortOrder === 'desc'
          ? b.maxPrice - a.maxPrice
          : a.maxPrice - b.maxPrice;
      case 'bids':
        return sortOrder === 'desc'
          ? (b.bids?.length || 0) - (a.bids?.length || 0)
          : (a.bids?.length || 0) - (b.bids?.length || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {searchQuery 
            ? `Search Results for "${searchQuery}"` 
            : role === 'buyer' 
              ? 'My Listings'
              : 'Current active items'}
        </h1>
        {role === 'buyer' && (
          <Link
            to="/items/add"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Add New Item
          </Link>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600"
          >
            <option value="all">All Categories</option>
            {Array.from(new Set(listings.map(l => l.category))).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortField(field as SortField);
              setSortOrder(order as SortOrder);
            }}
            className="rounded-md border-gray-300 dark:border-gray-600"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="price-desc">Highest Price</option>
            <option value="price-asc">Lowest Price</option>
            <option value="bids-desc">Most Bids</option>
            <option value="bids-asc">Least Bids</option>
          </select>
        </div>

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
                Bids
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Posted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedListings.map((listing) => (
              <tr key={listing.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link 
                    to={`/listings/${listing.id}`}
                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-900"
                  >
                    {listing.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    {listing.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatCurrency(listing.minPrice)} - {formatCurrency(listing.maxPrice)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/bids/received?item=${listing.id}`}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-900"
                  >
                    {listing.bids?.length || 0} bids
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(listing.created_at)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${listing.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                      listing.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}
                  >
                    {listing.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <Link
                      to={`/listings/${listing.id}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {/* Handle delete */}}
                      className="text-red-600 dark:text-red-400 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};