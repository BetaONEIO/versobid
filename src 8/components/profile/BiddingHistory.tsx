import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Bid } from '../../types';
import { formatCurrency, formatTimestamp } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function BiddingHistory() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchBids();
    }
  }, [user]);

  const fetchBids = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          item:items(*)
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBids(data);
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast.error('Failed to load bidding history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No bids placed yet</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {bids.map((bid) => (
        <div
          key={bid.id}
          className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(`/item/${bid.item_id}`)}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {bid.item?.title}
              </h3>
              <div className="flex items-center space-x-2">
                {getStatusIcon(bid.status)}
                <span className="text-sm font-medium capitalize text-gray-600 dark:text-gray-300">
                  {bid.status}
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(bid.amount)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatTimestamp(bid.created_at)}
              </span>
            </div>
            {bid.notes && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {bid.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}