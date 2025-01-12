import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListing } from '../hooks/useListing';
import { useUser } from '../contexts/UserContext';
import { DeleteListingModal } from '../components/ui/DeleteListingModal';
import { itemService } from '../services/itemService';
import { useNotification } from '../contexts/NotificationContext';
import { formatCurrency } from '../utils/formatters';
import { BidForm } from '../components/bids/BidForm';

export const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { listing, loading, error } = useListing(id!);
  const { auth, role } = useUser();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasPendingBids, setHasPendingBids] = useState(false);

  const handleDeleteClick = async () => {
    if (!id) return;
    const hasBids = await itemService.checkPendingBids(id);
    setHasPendingBids(hasBids);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (reason: string) => {
    try {
      await itemService.deleteListing(id!, reason);
      addNotification('success', 'Listing deleted successfully');
      navigate('/listings');
    } catch (error) {
      addNotification('error', 'Failed to delete listing');
    }
    setShowDeleteModal(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading listing details...</div>;
  }

  if (error || !listing) {
    return <div className="text-center text-red-600 py-8">{error || 'Listing not found'}</div>;
  }

  const isOwner = auth.user?.id === listing.seller_id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{listing.title}</h1>
          {isOwner && (
            <button
              onClick={handleDeleteClick}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete Listing
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {listing.description}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Category</dt>
                  <dd className="text-gray-900 dark:text-white">{listing.category}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Price Range</dt>
                  <dd className="text-gray-900 dark:text-white">
                    {formatCurrency(listing.minPrice)} - {formatCurrency(listing.maxPrice)}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Delivery Options</h2>
              <div className="space-y-2">
                {listing.shipping_options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-gray-900 dark:text-white">
                      {option.type === 'shipping' ? (
                        <>Shipping (up to {formatCurrency(option.cost || 0)})</>
                      ) : option.type === 'seller-pickup' ? (
                        <>Collection Available</>
                      ) : null}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!isOwner && role === 'seller' && (
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Place a Bid</h2>
              <BidForm 
                item={listing}
                onBidSubmitted={() => {
                  addNotification('success', 'Bid placed successfully');
                  navigate('/bids');
                }}
              />
            </div>
          )}

          {isOwner && (
            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200">
                This is your listing. You cannot bid on your own items.
              </p>
            </div>
          )}
        </div>
      </div>

      <DeleteListingModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        hasPendingBids={hasPendingBids}
      />
    </div>
  );
};