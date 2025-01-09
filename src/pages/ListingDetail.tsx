import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListing } from '../hooks/useListing';
import { useUser } from '../contexts/UserContext';
import { DeleteListingModal } from '../components/ui/DeleteListingModal';
import { itemService } from '../services/itemService';
import { useNotification } from '../contexts/NotificationContext';

export const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { listing, loading, error } = useListing(id!);
  const { auth } = useUser();
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
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{listing.title}</h1>
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
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {listing.description}
            </p>
            <div className="mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Category:</span>
              <span className="ml-2 text-gray-900 dark:text-gray-100">
                {listing.category}
              </span>
            </div>
            {isOwner && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-md">
                <p className="text-yellow-800 dark:text-yellow-200">
                  This is your listing. You cannot bid on your own items.
                </p>
              </div>
            )}
          </div>
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