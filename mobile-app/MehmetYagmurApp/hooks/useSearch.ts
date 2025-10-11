// Search Hook
// Powers search functionality with smart algorithms without UI changes

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/api.service';
import { Post } from '../types/post.types';
import { User } from '../types/user.types';

interface SearchFilters {
  type?: 'all' | 'posts' | 'users' | 'challenges' | 'time_based';
  contentType?: 'text' | 'image' | 'video' | 'reel';
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: 'relevance' | 'recent' | 'popular';
}

interface SearchResult {
  posts: Post[];
  users: User[];
  challenges: any[];
  suggestions: string[];
}

interface SearchState {
  query: string;
  results: SearchResult;
  loading: boolean;
  error: string | null;
  hasMore: {
    posts: boolean;
    users: boolean;
    challenges: boolean;
  };
  recentSearches: string[];
  popularSearches: string[];
  filters: SearchFilters;
}

interface SearchActions {
  search: (query: string, filters?: SearchFilters) => Promise<void>;
  loadMore: (type: 'posts' | 'users' | 'challenges') => Promise<void>;
  clearResults: () => void;
  addToRecentSearches: (query: string) => Promise<void>;
  clearRecentSearches: () => Promise<void>;
  getSuggestions: (query: string) => Promise<string[]>;
  setFilters: (filters: SearchFilters) => void;
  quickSearch: (query: string) => Promise<SearchResult>;
}

// Cache for search results and suggestions
const searchCache = new Map<string, { data: SearchResult; timestamp: number }>();
const suggestionCache = new Map<string, { data: string[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useSearch = (): SearchState & SearchActions => {
  // State management
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({
    posts: [],
    users: [],
    challenges: [],
    suggestions: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState({
    posts: true,
    users: true,
    challenges: true,
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [filters, setFiltersState] = useState<SearchFilters>({
    type: 'all',
    sortBy: 'relevance',
  });

  // Refs for pagination
  const postsPage = useRef(1);
  const usersPage = useRef(1);
  const challengesPage = useRef(1);

  // Debounce timer
  const debounceTimer = useRef<NodeJS.Timeout>();

  /**
   * Check if cached data is valid
   */
  const isCacheValid = useCallback((timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_DURATION;
  }, []);

  /**
   * Get cache key for search query and filters
   */
  const getCacheKey = useCallback((searchQuery: string, searchFilters: SearchFilters): string => {
    return `${searchQuery}_${JSON.stringify(searchFilters)}`;
  }, []);

  /**
   * Perform search with smart algorithm
   */
  const search = useCallback(async (
    searchQuery: string, 
    searchFilters: SearchFilters = filters
  ): Promise<void> => {
    if (!searchQuery.trim()) {
      setResults({ posts: [], users: [], challenges: [], suggestions: [] });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setQuery(searchQuery);

      // Check cache first
      const cacheKey = getCacheKey(searchQuery, searchFilters);
      const cached = searchCache.get(cacheKey);
      
      if (cached && isCacheValid(cached.timestamp)) {
        setResults(cached.data);
        setLoading(false);
        return;
      }

      // Reset pagination
      postsPage.current = 1;
      usersPage.current = 1;
      challengesPage.current = 1;

      const searchResults: SearchResult = {
        posts: [],
        users: [],
        challenges: [],
        suggestions: [],
      };

      // Search based on filters
      if (searchFilters.type === 'all' || searchFilters.type === 'posts') {
        const postsResponse = await apiService.searchPosts(searchQuery, {
          type: searchFilters.contentType,
          location: searchFilters.location,
          dateRange: searchFilters.dateRange,
        });
        
        if (postsResponse.success) {
          searchResults.posts = postsResponse.data;
          setHasMore(prev => ({ ...prev, posts: postsResponse.data.length === 20 }));
        }
      }

      if (searchFilters.type === 'all' || searchFilters.type === 'users') {
        const usersResponse = await apiService.searchUsers(searchQuery);
        
        if (usersResponse.success) {
          searchResults.users = usersResponse.data;
          setHasMore(prev => ({ ...prev, users: usersResponse.data.length === 20 }));
        }
      }

      // Get search suggestions
      const suggestionsResponse = await apiService.getSearchSuggestions(searchQuery);
      if (suggestionsResponse.success) {
        searchResults.suggestions = suggestionsResponse.data;
      }

      // Apply sorting
      if (searchFilters.sortBy === 'recent') {
        searchResults.posts.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      } else if (searchFilters.sortBy === 'popular') {
        searchResults.posts.sort((a, b) => 
          (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares)
        );
      }

      // Cache results
      searchCache.set(cacheKey, {
        data: searchResults,
        timestamp: Date.now(),
      });

      setResults(searchResults);

      // Add to recent searches
      await addToRecentSearches(searchQuery);

    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [filters, getCacheKey, isCacheValid]);

  /**
   * Load more results for pagination
   */
  const loadMore = useCallback(async (type: 'posts' | 'users' | 'challenges'): Promise<void> => {
    if (!query || loading || !hasMore[type]) return;

    try {
      setLoading(true);

      let newResults: any[] = [];
      let page = 1;

      switch (type) {
        case 'posts':
          page = postsPage.current + 1;
          postsPage.current = page;
          
          const postsResponse = await apiService.searchPosts(query, {
            type: filters.contentType,
            location: filters.location,
            dateRange: filters.dateRange,
          }, page);
          
          if (postsResponse.success) {
            newResults = postsResponse.data;
            setHasMore(prev => ({ ...prev, posts: newResults.length === 20 }));
          }
          break;

        case 'users':
          page = usersPage.current + 1;
          usersPage.current = page;
          
          const usersResponse = await apiService.searchUsers(query, page);
          
          if (usersResponse.success) {
            newResults = usersResponse.data;
            setHasMore(prev => ({ ...prev, users: newResults.length === 20 }));
          }
          break;

        case 'challenges':
          // Challenge search implementation would go here
          break;
      }

      // Append new results
      setResults(prev => ({
        ...prev,
        [type]: [...prev[type as keyof SearchResult] as any[], ...newResults],
      }));

    } catch (error) {
      console.error(`Load more ${type} error:`, error);
    } finally {
      setLoading(false);
    }
  }, [query, loading, hasMore, filters]);

  /**
   * Clear search results
   */
  const clearResults = useCallback((): void => {
    setResults({ posts: [], users: [], challenges: [], suggestions: [] });
    setQuery('');
    setError(null);
    setHasMore({ posts: true, users: true, challenges: true });
    
    // Reset pagination
    postsPage.current = 1;
    usersPage.current = 1;
    challengesPage.current = 1;
  }, []);

  /**
   * Add search query to recent searches
   */
  const addToRecentSearches = useCallback(async (searchQuery: string): Promise<void> => {
    try {
      const trimmedQuery = searchQuery.trim().toLowerCase();
      if (!trimmedQuery) return;

      setRecentSearches(prev => {
        const filtered = prev.filter(item => item.toLowerCase() !== trimmedQuery);
        return [searchQuery, ...filtered].slice(0, 10); // Keep last 10 searches
      });

      // Store in local storage (implementation would use AsyncStorage)
      console.log('Recent search added:', searchQuery);
    } catch (error) {
      console.error('Error adding to recent searches:', error);
    }
  }, []);

  /**
   * Clear recent searches
   */
  const clearRecentSearches = useCallback(async (): Promise<void> => {
    setRecentSearches([]);
    // Clear from local storage
    console.log('Recent searches cleared');
  }, []);

  /**
   * Get search suggestions with debouncing
   */
  const getSuggestions = useCallback(async (searchQuery: string): Promise<string[]> => {
    if (!searchQuery.trim()) return [];

    try {
      // Check cache first
      const cached = suggestionCache.get(searchQuery);
      if (cached && isCacheValid(cached.timestamp)) {
        return cached.data;
      }

      const response = await apiService.getSearchSuggestions(searchQuery);
      
      if (response.success) {
        const suggestions = response.data;
        
        // Cache suggestions
        suggestionCache.set(searchQuery, {
          data: suggestions,
          timestamp: Date.now(),
        });

        return suggestions;
      }

      return [];
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  }, [isCacheValid]);

  /**
   * Set search filters
   */
  const setFilters = useCallback((newFilters: SearchFilters): void => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    
    // Re-search if there's an active query
    if (query) {
      search(query, { ...filters, ...newFilters });
    }
  }, [query, filters, search]);

  /**
   * Quick search for autocomplete
   */
  const quickSearch = useCallback(async (searchQuery: string): Promise<SearchResult> => {
    if (!searchQuery.trim()) {
      return { posts: [], users: [], challenges: [], suggestions: [] };
    }

    try {
      // Limit quick search to fewer results for performance
      const [postsResponse, usersResponse, suggestionsResponse] = await Promise.all([
        apiService.searchPosts(searchQuery, {}, 1).catch(() => ({ success: false, data: [] })),
        apiService.searchUsers(searchQuery, 1).catch(() => ({ success: false, data: [] })),
        apiService.getSearchSuggestions(searchQuery).catch(() => ({ success: false, data: [] })),
      ]);

      return {
        posts: postsResponse.success ? postsResponse.data.slice(0, 5) : [],
        users: usersResponse.success ? usersResponse.data.slice(0, 5) : [],
        challenges: [], // Would be implemented
        suggestions: suggestionsResponse.success ? suggestionsResponse.data.slice(0, 5) : [],
      };
    } catch (error) {
      console.error('Quick search error:', error);
      return { posts: [], users: [], challenges: [], suggestions: [] };
    }
  }, []);

  /**
   * Debounced search for real-time suggestions
   */
  const debouncedSearch = useCallback((searchQuery: string, delay: number = 300): void => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (searchQuery.trim()) {
        getSuggestions(searchQuery).then(suggestions => {
          setResults(prev => ({ ...prev, suggestions }));
        });
      }
    }, delay);
  }, [getSuggestions]);

  // Load popular searches on mount
  useEffect(() => {
    const loadPopularSearches = async () => {
      try {
        // This would typically come from an API
        const popular = [
          'fitness', 'technology', 'travel', 'food', 'art',
          'music', 'sports', 'education', 'lifestyle', 'business'
        ];
        setPopularSearches(popular);
      } catch (error) {
        console.error('Error loading popular searches:', error);
      }
    };

    loadPopularSearches();
  }, []);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    // State
    query,
    results,
    loading,
    error,
    hasMore,
    recentSearches,
    popularSearches,
    filters,

    // Actions
    search,
    loadMore,
    clearResults,
    addToRecentSearches,
    clearRecentSearches,
    getSuggestions,
    setFilters,
    quickSearch,
  };
};