import { SearchResult } from './types';
import { supabase } from '../../lib/supabase';

export async function searchItems(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 3) {
    return [];
  }

  try {
    const { data: items, error } = await supabase
      .from('items')
      .select('title, min_price')
      .ilike('title', `%${query}%`)
      .limit(5);

    if (error) throw error;

    return (items || []).map(item => ({
      title: item.title,
      price: item.min_price
    }));
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}