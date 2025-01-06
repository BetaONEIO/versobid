import { useState } from 'react';
import { SearchResult } from '../types/search';
import { ebayService } from '../services/ebay/ebayService';
import { useNotification } from '../contexts/NotificationContext';

export const useEbaySearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const { addNotification } = useNotification();

  const searchItems = async (query: string) => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await ebayService.searchItems(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      addNotification('error', 'Failed to fetch item suggestions');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    results,
    searchItems
  };
};