import { useState, useEffect } from 'react';
import { Item } from '../types/item';
import { itemService } from '../services/itemService';
import { useUser } from '../contexts/UserContext';

export const useListings = () => {
  const [listings, setListings] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { role, auth } = useUser();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const filters = role === 'seller' ? { seller_id: auth.user?.id } : undefined;
        const items = await itemService.getItems(filters);
        setListings(items);
      } catch (err) {
        setError('Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    if (auth.isAuthenticated) {
      fetchListings();
    } else {
      setLoading(false);
    }
  }, [role, auth.user?.id, auth.isAuthenticated]);

  return { listings, loading, error };
};