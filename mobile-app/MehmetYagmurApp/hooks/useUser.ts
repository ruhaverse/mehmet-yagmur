// User Profile Hook
// Powers ProfileScreen and UserScreen with smart backend

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api.service';
import { User, UserProfile, UserStats } from '../types/user.types';
import { Post } from '../types/post.types';

interface UseUserOptions {
  includeStats?: boolean;
  includePosts?: boolean;
  autoRefresh?: boolean;
  cacheTimeout?: number; // minutes
}

interface UserState {
  user: UserProfile | null;
  posts: Post[];
  stats: UserStats | null;
  followers: User[];
  following: User[];
  loading: {
    profile: boolean;
    posts: boolean;
    stats: boolean;
    followers: boolean;
    following: boolean;
  };
  error: string | null;
  isFollowing: boolean;
  postsHasMore: boolean;
}

interface UserActions {
  refreshProfile: () => Promise<void>;
  loadUserPosts: (page?: number) => Promise<void>;
  toggleFollow: () => Promise<void>;
  loadFollowers: (page?: number) => Promise<User[]>;
  loadFollowing: (page?: number) => Promise<User[]>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  blockUser: () => Promise<void>;
  reportUser: (reason: string) => Promise<void>;
}

// Cache for user profiles
const userCache = new Map<string, { data: UserProfile; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const useUser = (
  userId: string,
  currentUserId?: string,
  options: UseUserOptions = {}
): UserState & UserActions => {
  const {
    includeStats = false,
    includePosts = true,
    autoRefresh = false,
    cacheTimeout = 10,
  } = options;

  // State management
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState({
    profile: false,
    posts: false,
    stats: false,
    followers: false,
    following: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [postsHasMore, setPostsHasMore] = useState(true);
  const [postsPage, setPostsPage] = useState(1);

  /**
   * Update loading state for specific operation
   */
  const updateLoading = useCallback((operation: keyof typeof loading, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [operation]: isLoading }));
  }, []);

  /**
   * Check if cached data is valid
   */
  const isCacheValid = useCallback((timestamp: number): boolean => {
    return Date.now() - timestamp < cacheTimeout * 60 * 1000;
  }, [cacheTimeout]);

  /**
   * Get user profile from cache or API
   */
  const getUserProfile = useCallback(async (useCache: boolean = true): Promise<UserProfile | null> => {
    try {
      // Check cache first
      if (useCache) {
        const cached = userCache.get(userId);
        if (cached && isCacheValid(cached.timestamp)) {
          return cached.data;
        }
      }

      updateLoading('profile', true);
      setError(null);

      const response = await apiService.getUserProfile(userId);
      
      if (response.success) {
        const userProfile = response.data;
        
        // Update cache
        userCache.set(userId, {
          data: userProfile,
          timestamp: Date.now(),
        });

        return userProfile;
      } else {
        throw new Error(response.error || 'Failed to load user profile');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load user';
      setError(errorMessage);
      console.error('User profile loading error:', error);
      return null;
    } finally {
      updateLoading('profile', false);
    }
  }, [userId, updateLoading, isCacheValid]);

  /**
   * Load user posts
   */
  const loadUserPosts = useCallback(async (page: number = 1): Promise<void> => {
    if (loading.posts) return;

    try {
      updateLoading('posts', true);
      setError(null);

      const response = await apiService.getUserPosts(userId, page);
      
      if (response.success) {
        const userPosts = response.data;
        
        if (page === 1) {
          setPosts(userPosts);
        } else {
          setPosts(prev => [...prev, ...userPosts]);
        }

        // Update pagination
        setPostsHasMore(userPosts.length === 20); // Assuming 20 per page
        setPostsPage(page);

      } else {
        throw new Error(response.error || 'Failed to load user posts');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load posts';
      setError(errorMessage);
      console.error('User posts loading error:', error);
    } finally {
      updateLoading('posts', false);
    }
  }, [userId, loading.posts, updateLoading]);

  /**
   * Load user statistics
   */
  const loadUserStats = useCallback(async (): Promise<void> => {
    if (!includeStats || loading.stats) return;

    try {
      updateLoading('stats', true);

      const response = await apiService.getUserStats(userId);
      
      if (response.success) {
        setStats(response.data);
      } else {
        console.error('Failed to load user stats:', response.error);
      }
    } catch (error) {
      console.error('User stats loading error:', error);
    } finally {
      updateLoading('stats', false);
    }
  }, [userId, includeStats, loading.stats, updateLoading]);

  /**
   * Refresh user profile
   */
  const refreshProfile = useCallback(async (): Promise<void> => {
    const userProfile = await getUserProfile(false); // Force refresh
    if (userProfile) {
      setUser(userProfile);
      
      // Check if current user is following this user
      if (currentUserId && userProfile.id !== currentUserId) {
        setIsFollowing(userProfile.isFollowing || false);
      }
    }

    // Refresh related data
    if (includePosts) {
      await loadUserPosts(1);
    }
    
    if (includeStats) {
      await loadUserStats();
    }
  }, [getUserProfile, currentUserId, includePosts, includeStats, loadUserPosts, loadUserStats]);

  /**
   * Toggle follow/unfollow user
   */
  const toggleFollow = useCallback(async (): Promise<void> => {
    if (!currentUserId || !user || user.id === currentUserId) return;

    try {
      // Optimistic update
      const wasFollowing = isFollowing;
      setIsFollowing(!wasFollowing);
      
      // Update follower count optimistically
      if (user) {
        setUser(prev => prev ? {
          ...prev,
          followerCount: wasFollowing ? prev.followerCount - 1 : prev.followerCount + 1,
        } : null);
      }

      const response = await apiService.toggleFollow(currentUserId, user.id);
      
      if (!response.success) {
        // Revert optimistic updates
        setIsFollowing(wasFollowing);
        if (user) {
          setUser(prev => prev ? {
            ...prev,
            followerCount: wasFollowing ? prev.followerCount + 1 : prev.followerCount - 1,
          } : null);
        }
        throw new Error(response.error || 'Failed to toggle follow');
      }

      // Update actual state from response
      setIsFollowing(response.data.following);

      // Track interaction
      await apiService.trackInteraction(
        currentUserId,
        response.data.following ? 'follow' : 'unfollow',
        user.id
      );

    } catch (error) {
      console.error('Follow toggle error:', error);
      setError(error instanceof Error ? error.message : 'Failed to update follow status');
    }
  }, [currentUserId, user, isFollowing]);

  /**
   * Load user followers
   */
  const loadFollowers = useCallback(async (page: number = 1): Promise<User[]> => {
    try {
      updateLoading('followers', true);

      const response = await apiService.getUserFollowers(userId, page);
      
      if (response.success) {
        const userFollowers = response.data;
        
        if (page === 1) {
          setFollowers(userFollowers);
        } else {
          setFollowers(prev => [...prev, ...userFollowers]);
        }

        return userFollowers;
      } else {
        throw new Error(response.error || 'Failed to load followers');
      }
    } catch (error) {
      console.error('Followers loading error:', error);
      return [];
    } finally {
      updateLoading('followers', false);
    }
  }, [userId, updateLoading]);

  /**
   * Load user following
   */
  const loadFollowing = useCallback(async (page: number = 1): Promise<User[]> => {
    try {
      updateLoading('following', true);

      const response = await apiService.getUserFollowing(userId, page);
      
      if (response.success) {
        const userFollowing = response.data;
        
        if (page === 1) {
          setFollowing(userFollowing);
        } else {
          setFollowing(prev => [...prev, ...userFollowing]);
        }

        return userFollowing;
      } else {
        throw new Error(response.error || 'Failed to load following');
      }
    } catch (error) {
      console.error('Following loading error:', error);
      return [];
    } finally {
      updateLoading('following', false);
    }
  }, [userId, updateLoading]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<void> => {
    if (!currentUserId || currentUserId !== userId) return;

    try {
      updateLoading('profile', true);

      const response = await apiService.updateUserProfile(userId, updates);
      
      if (response.success) {
        const updatedProfile = response.data;
        setUser(updatedProfile);
        
        // Update cache
        userCache.set(userId, {
          data: updatedProfile,
          timestamp: Date.now(),
        });

      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      updateLoading('profile', false);
    }
  }, [currentUserId, userId, updateLoading]);

  /**
   * Block user
   */
  const blockUser = useCallback(async (): Promise<void> => {
    if (!currentUserId || !user || user.id === currentUserId) return;

    try {
      // Implementation would call block API
      console.log('Block user functionality to be implemented');
    } catch (error) {
      console.error('Block user error:', error);
    }
  }, [currentUserId, user]);

  /**
   * Report user
   */
  const reportUser = useCallback(async (reason: string): Promise<void> => {
    if (!currentUserId || !user || user.id === currentUserId) return;

    try {
      // Implementation would call report API
      console.log('Report user functionality to be implemented', reason);
    } catch (error) {
      console.error('Report user error:', error);
    }
  }, [currentUserId, user]);

  // Initialize data on mount
  useEffect(() => {
    if (userId) {
      refreshProfile();
    }
  }, [userId]); // Only depend on userId

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && userId) {
      const interval = setInterval(() => {
        if (!loading.profile) {
          refreshProfile();
        }
      }, 2 * 60 * 1000); // 2 minutes

      return () => clearInterval(interval);
    }
  }, [autoRefresh, userId, loading.profile, refreshProfile]);

  return {
    // State
    user,
    posts,
    stats,
    followers,
    following,
    loading,
    error,
    isFollowing,
    postsHasMore,

    // Actions
    refreshProfile,
    loadUserPosts,
    toggleFollow,
    loadFollowers,
    loadFollowing,
    updateProfile,
    blockUser,
    reportUser,
  };
};