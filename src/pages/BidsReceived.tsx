import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { bidService } from '../services/bidService';
import { Bid } from '../types/bid';
import { formatCurrency } from '../utils/formatters';

export const BidsReceived: React.FC = () => {
  const { auth } = useUser();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      if (!auth.user?.id) return;
      try {
        const data = await bidService.getReceivedBids(auth.user.id);
        setBids(data);
      } catch (error) {
        console.error('Failed to fetch bids:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [auth.user?.id]);

  if (loading) {
    return <div className="text-center py-8">Loading bids...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Bids Received</h1>
      <div className="grid gap-4">
        {bids.map((bid) => (
          <div key={bid.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{bid.item?.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Bid by: {bid.bidder?.username}
                </p>
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(bid.amount)}
                </p>
                {bid.message && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{bid.message}</p>
                )}
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                {bid.status}
              </span>
            </div>
          </div>
        ))}
        {bids.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No bids received yet.
          </p>
        )}
      </div>
    </div>
  );
};