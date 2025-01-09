export interface SearchResult {
  title: string;
  imageUrl?: string;
  price?: number;
}

export interface SearchResponse {
  success: boolean;
  results: SearchResult[];
  error?: string;
}