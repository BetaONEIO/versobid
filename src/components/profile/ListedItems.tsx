import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { Clock, DollarSign } from 'lucide-react';
import { Item } from '../../types';
import { formatCurrency, formatTimestamp } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function ListedItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
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

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No items listed yet</p>
        <button
          onClick={() => navigate('/create-item')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create Your First Listing
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(`/item/${item.id}`)}
        >
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {item.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {item.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="ml-1 font-medium">{formatCurrency(item.target_price)}</span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {formatTimestamp(item.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}