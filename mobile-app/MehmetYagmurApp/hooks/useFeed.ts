// Smart Feed Hook
// Powers NewsFeedScreen with intelligent backend without UI changes

import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, feedActions } from '../store/store';
import { feedService } from '../services/feed.service';
import { apiService } from '../services/api.service';
import { realTimeService } from '../services/realtime.service';
import { Post } from '../types/post.types';

interface UseFeedOptions {
  algorithm?: 'smart' | 'chronological' | 'trending';
  filters?: {
    contentTypes?: string[];
    timeRange?: string;
    friendsOnly?: boolean;
  };
  autoRefresh?: boolean;
  realTimeUpdates?: boolean;
}

interface FeedState {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

interface FeedActions {
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  toggleBookmark: (postId: string) => Promise<void>;
  sharePost: (postId: string, message?: string) => Promise<void>;
  setAlgorithm: (algorithm: 'smart' | 'chronological' | 'trending') => void;
  setFilters: (filters: any) => void;
  retryOnError: () => Promise<void>;
}

export const useFeed = (userId: string, options: UseFeedOptions = {}): FeedState & FeedActions => {
  const dispatch = useDispatch();
  
  // Redux state selectors
  const posts = useSelector((state: RootState) => state.feed.posts);
  const loading = useSelector((state: RootState) => state.feed.loading);
  const refreshing = useSelector((state: RootState) => state.feed.refreshing);
  const error = useSelector((state: RootState) => state.feed.error);
  const hasMore = useSelector((state: RootState) => state.feed.hasMore);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  
  // Local state
  const [page, setPage] = useState(1);
  
  const {
    algorithm = 'smart',
    filters = {},
    autoRefresh = true,
    realTimeUpdates = true,
  } = options;

  /**
   * Load feed posts with smart algorithm
   */
  const loadFeed = useCallback(async (pageNum: number = 1, isRefresh: boolean = false): Promise<void> => {
    if (loading && !isRefresh) return;
    
    try {
      if (isRefresh) {
        dispatch(feedActions.setRefreshing(true));
        dispatch(feedActions.resetFeed());
        setPage(1);
      } else {
        dispatch(feedActions.setLoading(true));
      }

      dispatch(feedActions.clearError());

      // Use smart algorithm for enhanced feed
      let feedPosts: Post[];
      
      if (algorithm === 'smart') {
        // Enhanced feed service with AI-like algorithm
        feedPosts = await feedService.generatePersonalizedFeed(
          userId,
          20, // limit
          (pageNum - 1) * 20 // offset
        );
      } else {
        // Fallback to API service
        const response = await apiService.getFeed({
          userId,
          page: pageNum,
          limit: 20,
          algorithm,
          filters,
        });
        
        if (response.success) {
          feedPosts = response.data;
          
          // Update pagination info
          if (response.pagination) {
            dispatch(feedActions.setPagination(response.pagination));
            dispatch(feedActions.setHasMore(response.pagination.hasMore));
          }
        } else {
          throw new Error(response.error || 'Failed to load feed');
        }
      }

      // Update Redux store
      if (isRefresh || pageNum === 1) {
        dispatch(feedActions.setPosts(feedPosts));
      } else {
        dispatch(feedActions.addPosts(feedPosts));
      }

      // Update has more based on returned data
      if (feedPosts.length < 20) {
        dispatch(feedActions.setHasMore(false));
      }

      setPage(pageNum);

    } catch (error) {
      console.error('Feed loading error:', error);
      dispatch(feedActions.setError(error instanceof Error ? error.message : 'Failed to load feed'));
    } finally {
      dispatch(feedActions.setLoading(false));
      dispatch(feedActions.setRefreshing(false));
    }
  }, [userId, algorithm, filters, loading, dispatch]);

  /**
   * Refresh feed (pull-to-refresh)
   */
  const refresh = useCallback(async (): Promise<void> => {
    await loadFeed(1, true);
  }, [loadFeed]);

  /**
   * Load more posts (pagination)
   */
  const loadMore = useCallback(async (): Promise<void> => {
    if (hasMore && !loading) {
      await loadFeed(page + 1, false);
    }
  }, [hasMore, loading, page, loadFeed]);

  /**
   * Toggle post like with optimistic updates
   */
  const toggleLike = useCallback(async (postId: string): Promise<void> => {
    if (!currentUser) return;

    try {
      // Optimistic update
      dispatch(feedActions.toggleLike(postId));

      // API call
      const response = await apiService.toggleLike(postId, currentUser.id);
      
      if (!response.success) {
        // Revert optimistic update on error
        dispatch(feedActions.toggleLike(postId));
        throw new Error(response.error || 'Failed to toggle like');
      }

      // Track interaction for analytics
      await apiService.trackInteraction(currentUser.id, 'like', postId);

    } catch (error) {
      console.error('Like toggle error:', error);
    }
  }, [currentUser, dispatch]);

  /**
   * Toggle post bookmark
   */
  const toggleBookmark = useCallback(async (postId: string): Promise<void> => {
    if (!currentUser) return;

    try {
      // Optimistic update
      dispatch(feedActions.toggleBookmark(postId));

      // API call
      const response = await apiService.toggleBookmark(postId, currentUser.id);
      
      if (!response.success) {
        // Revert optimistic update on error
        dispatch(feedActions.toggleBookmark(postId));
        throw new Error(response.error || 'Failed to toggle bookmark');
      }

    } catch (error) {
      console.error('Bookmark toggle error:', error);
    }
  }, [currentUser, dispatch]);

  /**
   * Share post
   */
  const sharePost = useCallback(async (postId: string, message?: string): Promise<void> => {
    if (!currentUser) return;

    try {
      // Optimistic update
      dispatch(feedActions.incrementShares(postId));

      // API call
      const response = await apiService.sharePost(postId, currentUser.id, message);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to share post');
      }

      // Track interaction
      await apiService.trackInteraction(currentUser.id, 'share', postId, { message });

    } catch (error) {
      console.error('Share post error:', error);
    }
  }, [currentUser, dispatch]);

  /**
   * Change feed algorithm
   */
  const setAlgorithm = useCallback((newAlgorithm: 'smart' | 'chronological' | 'trending'): void => {
    dispatch(feedActions.setAlgorithm(newAlgorithm));
    // Refresh feed with new algorithm
    loadFeed(1, true);
  }, [dispatch, loadFeed]);

  /**
   * Update feed filters
   */
  const setFilters = useCallback((newFilters: any): void => {
    dispatch(feedActions.setFilters(newFilters));
    // Refresh feed with new filters
    loadFeed(1, true);
  }, [dispatch, loadFeed]);

  /**
   * Retry on error
   */
  const retryOnError = useCallback(async (): Promise<void> => {
    dispatch(feedActions.clearError());
    await loadFeed(1, true);
  }, [dispatch, loadFeed]);

  // Initialize feed on mount
  useEffect(() => {
    if (userId) {
      loadFeed(1, true);
    }
  }, [userId]); // Only depend on userId to avoid infinite loops

  // Setup real-time updates
  useEffect(() => {
    if (realTimeUpdates && userId) {
      const handleNewPost = (post: Post) => {
        // Add new post to feed if it matches criteria
        dispatch(feedActions.addPosts([post]));
      };

      const handlePostUpdate = (updatedPost: Post) => {
        dispatch(feedActions.updatePost(updatedPost));
      };

      // Subscribe to real-time events
      realTimeService.on('new_post', handleNewPost);
      realTimeService.on('post_liked', handlePostUpdate);
      realTimeService.on('post_commented', handlePostUpdate);

      // Cleanup
      return () => {
        realTimeService.off('new_post', handleNewPost);
        realTimeService.off('post_liked', handlePostUpdate);
        realTimeService.off('post_commented', handlePostUpdate);
      };
    }
  }, [realTimeUpdates, userId, dispatch]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && userId) {
      const interval = setInterval(() => {
        // Refresh feed every 5 minutes in background
        if (!loading && !refreshing) {
          loadFeed(1, true);
        }
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [autoRefresh, userId, loading, refreshing, loadFeed]);

  return {
    // State
    posts,
    loading,
    refreshing,
    error,
    hasMore,
    page,
    
    // Actions
    refresh,
    loadMore,
    toggleLike,
    toggleBookmark,
    sharePost,
    setAlgorithm,
    setFilters,
    retryOnError,
  };
};