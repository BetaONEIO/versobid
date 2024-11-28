import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Bid } from '../../types';
import { formatTimestamp, formatCurrency } from '../../lib/utils';

interface BidHistoryProps {
  bids: Bid[];
}

export default function BidHistory({ bids }: BidHistoryProps) {
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
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Bid History ({bids.length})
      </h3>

      <div className="space-y-4">
        {bids.map((bid) => (
          <div
            key={bid.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {bid.seller?.avatar_url ? (
                  <img
                    src={bid.seller.avatar_url}
                    alt={bid.seller.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                      {bid.seller?.name?.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {bid.seller?.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTimestamp(bid.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(bid.amount)}
                </span>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(bid.status)}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {bid.status}
                  </span>
                </div>
              </div>
            </div>
            {bid.notes && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {bid.notes}
              </p>
            )}
          </div>
        ))}

        {bids.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No bids yet. Be the first to make an offer!
          </p>
        )}
      </div>
    </div>
  );
}