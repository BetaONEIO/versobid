import React from 'react';
import { BidList } from '../components/bids/BidList';
import { useBids } from '../hooks/useBids';
import { useUser } from '../contexts/UserContext';

export const Bids: React.FC = () => {
  const { bids, loading, error } = useBids();
  const { role } = useUser();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600 dark:text-gray-300">Loading bids...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  const emptyMessage = role === 'seller' 
    ? "You have not placed any bids"
    : "You have received no bids";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {role === 'seller' ? 'My Bids' : 'Bids Received'}
      </h1>
      
      {bids.length === 0 ? (
        <div className="flex justify-center items-center min-h-[30vh] bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <BidList bids={bids} />
      )}
    </div>
  );
};