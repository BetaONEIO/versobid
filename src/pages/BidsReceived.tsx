import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { bidService } from '../services/bidService';
import { Bid } from '../types/bid';
import { formatCurrency } from '../utils/formatters';

export const BidsReceived: React.FC = () => {
  const { auth, role } = useUser();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      if (!auth.user?.id) return;
      try {
        // Get different bids based on user role
        const data = role === 'buyer' 
          ? await bidService.getReceivedBids(auth.user.id)  // Bids received on buyer's wanted items
          : await bidService.getBidsForItem(auth.user.id);  // Bids made by seller on others' items
        setBids(data);
      } catch (error) {
        console.error('Failed to fetch bids:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [auth.user?.id, role]);

  if (loading) {
    return <div className="text-center py-8">Loading bids...</div>;
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'countered':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getEmptyMessage = () => {
    if (role === 'buyer') {
      return "You have not received any bids";
    }
    return "You have not bid on any items yet";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {role === 'buyer' ? 'Bids Received' : 'My Bids'}
      </h1>
      
      {bids.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            {getEmptyMessage()}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bids.map((bid) => (
            <div key={bid.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{bid.item?.title}</h3>
                  {role === 'buyer' ? (
                    <p className="text-gray-600 dark:text-gray-300">
                      Bid by: {bid.bidder?.username}
                    </p>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">
                      Your bid on seller's item
                    </p>
                  )}
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(bid.amount)}
                  </p>
                  {bid.message && (
                    <p className="mt-2 text-gray-600 dark:text-gray-300">{bid.message}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(bid.status)}`}>
                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};