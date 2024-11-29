```typescript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Tag, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUserContext } from '../context/UserContext';
import { Item } from '../types';
import PlaceBidModal from '../components/items/PlaceBidModal';
import BidHistory from '../components/items/BidHistory';
import ItemImageGallery from '../components/items/ItemImageGallery';
import { formatCurrency, formatTimestamp } from '../lib/utils';
import toast from 'react-hot-toast';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useUserContext();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          buyer:profiles(*),
          bids(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setItem(data);
    } catch (error) {
      console.error('Error fetching item:', error);
      toast.error('Failed to load item details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h3 className="mt-2 text-lg font-medium text-gray-900">Item not found</h3>
          <p className="mt-1 text-sm text-gray-500">The item you're looking for doesn't exist or has been removed.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ItemImageGallery images={[item.imageUrl || '']} />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{item.title}</h1>
            <div className="mt-2 flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {item.category}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Posted by {item.buyer?.name}
              </span>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p>{item.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <DollarSign className="h-5 w-5" />
              <span>Target Price: {formatCurrency(item.targetPrice)}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Clock className="h-5 w-5" />
              <span>Deadline: {formatTimestamp(item.deadline)}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Tag className="h-5 w-5" />
              <span>Condition: {item.condition}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <MapPin className="h-5 w-5" />
              <span>{item.location}</span>
            </div>
          </div>

          {userRole === 'seller' && item.status === 'open' && (
            <div className="mt-6">
              <button
                onClick={() => setShowBidModal(true)}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Place Bid
              </button>
            </div>
          )}

          <BidHistory bids={item.bids || []} />
        </div>
      </div>

      {showBidModal && (
        <PlaceBidModal
          item={item}
          onClose={() => setShowBidModal(false)}
          onBidPlaced={fetchItem}
        />
      )}
    </div>
  );
}
```