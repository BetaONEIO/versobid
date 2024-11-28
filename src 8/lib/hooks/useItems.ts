import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Item } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*, buyer:profiles(*), bids(*)')
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

  const createItem = async (itemData: Partial<Item>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('items')
        .insert([
          {
            ...itemData,
            buyer_id: user.id,
            status: 'open',
          }
        ]);

      if (error) throw error;
      await fetchItems();
      toast.success('Item created successfully');
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error('Failed to create item');
      throw error;
    }
  };

  return {
    items,
    loading,
    createItem,
    refreshItems: fetchItems,
  };
}