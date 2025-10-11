// API Service Layer
// Provides smart backend integration without changing screen interfaces

import { Post, Comment } from '../types/post.types';
import { User, UserProfile, UserStats } from '../types/user.types';

interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

interface FeedRequest {
  userId: string;
  page?: number;
  limit?: number;
  algorithm?: 'smart' | 'chronological' | 'trending';
  filters?: {
    contentTypes?: string[];
    timeRange?: string;
    friends?: boolean;
    location?: string;
  };
}

interface PostRequest {
  content: string;
  images?: string[];
  videos?: string[];
  location?: string;
  tags?: string[];
  type?: 'post' | 'reel' | 'swap' | 'challenge' | 'time_based';
  timeConstraints?: {
    startTime: string;
    endTime: string;
    duration?: number;
  };
  visibility?: 'public' | 'friends' | 'private';
}

class APIService {
  private baseURL: string = 'https://api.shareuptime.com'; // Mock URL
  private token: string = '';

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.token = token;
  }

  /**
   * Generic API request method
   */
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : '',
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        pagination: data.pagination,
      };
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      return {
        success: false,
        data: {} as T,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // =================== FEED API ===================

  /**
   * Get personalized feed with smart algorithm
   * This method will be called by NewsFeedScreen but screen won't change
   */
  async getFeed(request: FeedRequest): Promise<APIResponse<Post[]>> {
    const params = new URLSearchParams({
      userId: request.userId,
      page: (request.page || 1).toString(),
      limit: (request.limit || 20).toString(),
      algorithm: request.algorithm || 'smart',
    });

    // Add filters if provided
    if (request.filters?.contentTypes) {
      params.append('contentTypes', request.filters.contentTypes.join(','));
    }
    if (request.filters?.timeRange) {
      params.append('timeRange', request.filters.timeRange);
    }
    if (request.filters?.friends) {
      params.append('friendsOnly', request.filters.friends.toString());
    }

    return this.request<Post[]>(`/feed?${params.toString()}`);
  }

  /**
   * Get trending posts for explore section
   */
  async getTrendingPosts(
    page: number = 1, 
    limit: number = 20,
    category?: string
  ): Promise<APIResponse<Post[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (category) {
      params.append('category', category);
    }

    return this.request<Post[]>(`/posts/trending?${params.toString()}`);
  }

  /**
   * Get time-based posts for current time
   */
  async getTimeBasedPosts(userId: string): Promise<APIResponse<Post[]>> {
    return this.request<Post[]>(`/posts/time-based?userId=${userId}`);
  }

  // =================== POST API ===================

  /**
   * Create new post
   */
  async createPost(postData: PostRequest): Promise<APIResponse<Post>> {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  /**
   * Like/Unlike post
   */
  async toggleLike(postId: string, userId: string): Promise<APIResponse<{ liked: boolean }>> {
    return this.request<{ liked: boolean }>(`/posts/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  /**
   * Bookmark/Unbookmark post
   */
  async toggleBookmark(postId: string, userId: string): Promise<APIResponse<{ bookmarked: boolean }>> {
    return this.request<{ bookmarked: boolean }>(`/posts/${postId}/bookmark`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  /**
   * Share post
   */
  async sharePost(postId: string, userId: string, message?: string): Promise<APIResponse<void>> {
    return this.request<void>(`/posts/${postId}/share`, {
      method: 'POST',
      body: JSON.stringify({ userId, message }),
    });
  }

  /**
   * Get post comments
   */
  async getPostComments(postId: string, page: number = 1): Promise<APIResponse<Comment[]>> {
    return this.request<Comment[]>(`/posts/${postId}/comments?page=${page}`);
  }

  /**
   * Add comment to post
   */
  async addComment(postId: string, userId: string, content: string): Promise<APIResponse<Comment>> {
    return this.request<Comment>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ userId, content }),
    });
  }

  // =================== USER API ===================

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<APIResponse<UserProfile>> {
    return this.request<UserProfile>(`/users/${userId}`);
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<APIResponse<UserProfile>> {
    return this.request<UserProfile>(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Get user posts
   */
  async getUserPosts(userId: string, page: number = 1): Promise<APIResponse<Post[]>> {
    return this.request<Post[]>(`/users/${userId}/posts?page=${page}`);
  }

  /**
   * Get user followers
   */
  async getUserFollowers(userId: string, page: number = 1): Promise<APIResponse<User[]>> {
    return this.request<User[]>(`/users/${userId}/followers?page=${page}`);
  }

  /**
   * Get user following
   */
  async getUserFollowing(userId: string, page: number = 1): Promise<APIResponse<User[]>> {
    return this.request<User[]>(`/users/${userId}/following?page=${page}`);
  }

  /**
   * Follow/Unfollow user
   */
  async toggleFollow(userId: string, targetUserId: string): Promise<APIResponse<{ following: boolean }>> {
    return this.request<{ following: boolean }>(`/users/${targetUserId}/follow`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  /**
   * Search users
   */
  async searchUsers(query: string, page: number = 1): Promise<APIResponse<User[]>> {
    return this.request<User[]>(`/users/search?q=${encodeURIComponent(query)}&page=${page}`);
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<APIResponse<UserStats>> {
    return this.request<UserStats>(`/users/${userId}/stats`);
  }

  // =================== SEARCH API ===================

  /**
   * Search posts
   */
  async searchPosts(
    query: string, 
    filters?: {
      type?: string;
      location?: string;
      dateRange?: { start: string; end: string };
    },
    page: number = 1
  ): Promise<APIResponse<Post[]>> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
    });

    if (filters?.type) params.append('type', filters.type);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start);
      params.append('endDate', filters.dateRange.end);
    }

    return this.request<Post[]>(`/search/posts?${params.toString()}`);
  }

  /**
   * Get search suggestions
   */
  async getSearchSuggestions(query: string): Promise<APIResponse<string[]>> {
    return this.request<string[]>(`/search/suggestions?q=${encodeURIComponent(query)}`);
  }

  // =================== ANALYTICS API ===================

  /**
   * Track user interaction
   */
  async trackInteraction(
    userId: string, 
    type: string, 
    targetId: string, 
    metadata?: Record<string, any>
  ): Promise<APIResponse<void>> {
    return this.request<void>('/analytics/interaction', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        type,
        targetId,
        timestamp: new Date().toISOString(),
        metadata,
      }),
    });
  }

  /**
   * Get feed performance metrics
   */
  async getFeedAnalytics(userId: string, timeRange: string): Promise<APIResponse<any>> {
    return this.request<any>(`/analytics/feed/${userId}?timeRange=${timeRange}`);
  }

  // =================== REAL-TIME API ===================

  /**
   * Get real-time updates (for WebSocket fallback)
   */
  async getRealTimeUpdates(userId: string, lastUpdate: string): Promise<APIResponse<any[]>> {
    return this.request<any[]>(`/realtime/updates?userId=${userId}&since=${lastUpdate}`);
  }

  // =================== OFFLINE SUPPORT ===================

  /**
   * Sync offline actions when back online
   */
  async syncOfflineActions(actions: any[]): Promise<APIResponse<any[]>> {
    return this.request<any[]>('/sync/offline', {
      method: 'POST',
      body: JSON.stringify({ actions }),
    });
  }

  /**
   * Get cached data for offline mode
   */
  async getCacheData(userId: string, dataTypes: string[]): Promise<APIResponse<any>> {
    const params = new URLSearchParams({
      userId,
      types: dataTypes.join(','),
    });

    return this.request<any>(`/cache?${params.toString()}`);
  }
}

// Export singleton instance
export const apiService = new APIService();
export default apiService;