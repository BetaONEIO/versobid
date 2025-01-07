import { useState } from 'react';
import { SearchResult } from '../types/search';
import { ebayService } from '../services/ebay/ebayService';
import { useNotification } from '../contexts/NotificationContext';
import { debounce } from '../utils/debounce';

export const useEbaySearch = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const { addNotification } = useNotification();

  const searchItems = debounce(async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await ebayService.searchItems(query);
      setSuggestions(results);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      addNotification('error', 'Failed to fetch item suggestions');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  return {
    loading,
    suggestions,
    searchItems
  };
};