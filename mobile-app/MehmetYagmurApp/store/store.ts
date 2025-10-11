// Redux Store Configuration
// Enhanced state management without changing existing screen logic

import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../types/post.types';
import { User } from '../types/user.types';

// =================== FEED SLICE ===================
interface FeedState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  refreshing: boolean;
  algorithm: 'smart' | 'chronological' | 'trending';
  filters: {
    contentTypes: string[];
    timeRange: string | null;
    friendsOnly: boolean;
  };
  lastUpdated: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialFeedState: FeedState = {
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
  refreshing: false,
  algorithm: 'smart',
  filters: {
    contentTypes: [],
    timeRange: null,
    friendsOnly: false,
  },
  lastUpdated: '',
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

const feedSlice = createSlice({
  name: 'feed',
  initialState: initialFeedState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },

    // Feed data management
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },

    addPosts: (state, action: PayloadAction<Post[]>) => {
      const existingIds = new Set(state.posts.map(post => post.id));
      const newPosts = action.payload.filter(post => !existingIds.has(post.id));
      state.posts.push(...newPosts);
      state.lastUpdated = new Date().toISOString();
    },

    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },

    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },

    // Post interactions (maintains existing behavior)
    toggleLike: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
      }
    },

    toggleBookmark: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.isBookmarked = !post.isBookmarked;
      }
    },

    incrementShares: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.shares += 1;
      }
    },

    incrementComments: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.comments += 1;
      }
    },

    // Algorithm and filters
    setAlgorithm: (state, action: PayloadAction<'smart' | 'chronological' | 'trending'>) => {
      state.algorithm = action.payload;
    },

    setFilters: (state, action: PayloadAction<Partial<FeedState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Error handling
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
      state.refreshing = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Pagination
    setPagination: (state, action: PayloadAction<Partial<FeedState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },

    // Reset feed (for refresh)
    resetFeed: (state) => {
      state.posts = [];
      state.pagination.page = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
});

// =================== USER SLICE ===================
interface UserState {
  currentUser: User | null;
  userProfiles: Record<string, User>;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  followingUsers: string[];
  blockedUsers: string[];
  preferences: {
    notifications: Record<string, boolean>;
    privacy: Record<string, any>;
    algorithm: Record<string, any>;
  };
}

const initialUserState: UserState = {
  currentUser: null,
  userProfiles: {},
  loading: false,
  error: null,
  isAuthenticated: false,
  followingUsers: [],
  blockedUsers: [],
  preferences: {
    notifications: {},
    privacy: {},
    algorithm: {},
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    // Authentication
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.userProfiles = {};
      state.followingUsers = [];
    },

    // User profiles cache
    addUserProfile: (state, action: PayloadAction<User>) => {
      state.userProfiles[action.payload.id] = action.payload;
    },

    updateUserProfile: (state, action: PayloadAction<Partial<User> & { id: string }>) => {
      const userId = action.payload.id;
      if (state.userProfiles[userId]) {
        state.userProfiles[userId] = { ...state.userProfiles[userId], ...action.payload };
      }
      if (state.currentUser?.id === userId) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },

    // Following/Followers
    addFollowing: (state, action: PayloadAction<string>) => {
      if (!state.followingUsers.includes(action.payload)) {
        state.followingUsers.push(action.payload);
      }
    },

    removeFollowing: (state, action: PayloadAction<string>) => {
      state.followingUsers = state.followingUsers.filter(id => id !== action.payload);
    },

    // Blocked users
    blockUser: (state, action: PayloadAction<string>) => {
      if (!state.blockedUsers.includes(action.payload)) {
        state.blockedUsers.push(action.payload);
      }
    },

    unblockUser: (state, action: PayloadAction<string>) => {
      state.blockedUsers = state.blockedUsers.filter(id => id !== action.payload);
    },

    // Preferences
    updatePreferences: (state, action: PayloadAction<{
      type: 'notifications' | 'privacy' | 'algorithm';
      preferences: Record<string, any>;
    }>) => {
      const { type, preferences } = action.payload;
      state.preferences[type] = { ...state.preferences[type], ...preferences };
    },

    // Loading and error states
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearUserError: (state) => {
      state.error = null;
    },
  },
});

// =================== REAL-TIME SLICE ===================
interface RealTimeState {
  connected: boolean;
  notifications: any[];
  unreadCount: number;
  onlineUsers: string[];
  lastActivity: string;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const initialRealTimeState: RealTimeState = {
  connected: false,
  notifications: [],
  unreadCount: 0,
  onlineUsers: [],
  lastActivity: '',
  connectionStatus: 'disconnected',
};

const realTimeSlice = createSlice({
  name: 'realTime',
  initialState: initialRealTimeState,
  reducers: {
    // Connection management
    setConnectionStatus: (state, action: PayloadAction<RealTimeState['connectionStatus']>) => {
      state.connectionStatus = action.payload;
      state.connected = action.payload === 'connected';
    },

    // Notifications
    addNotification: (state, action: PayloadAction<any>) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },

    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllNotificationsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },

    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    // Online users
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },

    addOnlineUser: (state, action: PayloadAction<string>) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },

    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
    },

    // Activity tracking
    updateLastActivity: (state) => {
      state.lastActivity = new Date().toISOString();
    },
  },
});

// =================== STORE CONFIGURATION ===================

export const store = configureStore({
  reducer: {
    feed: feedSlice.reducer,
    user: userSlice.reducer,
    realTime: realTimeSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export action creators
export const feedActions = feedSlice.actions;
export const userActions = userSlice.actions;
export const realTimeActions = realTimeSlice.actions;

// Selectors for easy state access
export const selectFeedPosts = (state: RootState) => state.feed.posts;
export const selectFeedLoading = (state: RootState) => state.feed.loading;
export const selectFeedError = (state: RootState) => state.feed.error;
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectNotifications = (state: RootState) => state.realTime.notifications;
export const selectUnreadCount = (state: RootState) => state.realTime.unreadCount;

export default store;