// Offline Support Hook
// Provides seamless offline experience without changing UI

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { apiService } from '../services/api.service';

interface OfflineAction {
  id: string;
  type: 'like' | 'bookmark' | 'follow' | 'share' | 'comment' | 'post_create';
  payload: any;
  timestamp: string;
  retryCount: number;
}

interface OfflineState {
  isOnline: boolean;
  isConnected: boolean;
  connectionType: string | null;
  pendingActions: OfflineAction[];
  syncInProgress: boolean;
  lastSyncTime: string | null;
}

interface OfflineActions {
  queueAction: (type: string, payload: any) => Promise<void>;
  syncPendingActions: () => Promise<void>;
  clearPendingActions: () => Promise<void>;
  getCachedData: (key: string) => Promise<any | null>;
  setCachedData: (key: string, data: any, ttl?: number) => Promise<void>;
  removeCachedData: (key: string) => Promise<void>;
  getOfflineCapabilities: () => OfflineCapabilities;
}

interface OfflineCapabilities {
  canLike: boolean;
  canBookmark: boolean;
  canFollow: boolean;
  canShare: boolean;
  canComment: boolean;
  canCreatePost: boolean;
  canViewCached: boolean;
}

// Storage keys
const STORAGE_KEYS = {
  PENDING_ACTIONS: 'offline_pending_actions',
  CACHED_FEED: 'cached_feed_data',
  CACHED_USERS: 'cached_user_profiles',
  CACHED_POSTS: 'cached_posts_data',
  LAST_SYNC: 'last_sync_time',
  OFFLINE_SETTINGS: 'offline_settings',
};

export const useOffline = (): OfflineState & OfflineActions => {
  // State management
  const [isOnline, setIsOnline] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([]);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  /**
   * Generate unique ID for offline actions
   */
  const generateActionId = useCallback((): string => {
    return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * Load pending actions from storage
   */
  const loadPendingActions = useCallback(async (): Promise<void> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS);
      if (stored) {
        const actions: OfflineAction[] = JSON.parse(stored);
        setPendingActions(actions);
      }
    } catch (error) {
      console.error('Error loading pending actions:', error);
    }
  }, []);

  /**
   * Save pending actions to storage
   */
  const savePendingActions = useCallback(async (actions: OfflineAction[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_ACTIONS, JSON.stringify(actions));
    } catch (error) {
      console.error('Error saving pending actions:', error);
    }
  }, []);

  /**
   * Queue action for offline execution
   */
  const queueAction = useCallback(async (type: string, payload: any): Promise<void> => {
    if (isOnline) {
      // If online, execute immediately
      return;
    }

    const action: OfflineAction = {
      id: generateActionId(),
      type: type as OfflineAction['type'],
      payload,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };

    const newActions = [...pendingActions, action];
    setPendingActions(newActions);
    await savePendingActions(newActions);

    console.log(`Queued offline action: ${type}`, action);
  }, [isOnline, pendingActions, generateActionId, savePendingActions]);

  /**
   * Sync pending actions when back online
   */
  const syncPendingActions = useCallback(async (): Promise<void> => {
    if (!isOnline || syncInProgress || pendingActions.length === 0) {
      return;
    }

    setSyncInProgress(true);
    console.log(`Syncing ${pendingActions.length} offline actions...`);

    const failedActions: OfflineAction[] = [];
    const successfulActionIds: string[] = [];

    try {
      for (const action of pendingActions) {
        try {
          await executeOfflineAction(action);
          successfulActionIds.push(action.id);
          console.log(`Successfully synced action: ${action.type}`, action.id);
        } catch (error) {
          console.error(`Failed to sync action ${action.id}:`, error);
          
          // Retry logic
          if (action.retryCount < 3) {
            failedActions.push({
              ...action,
              retryCount: action.retryCount + 1,
            });
          } else {
            console.log(`Action ${action.id} exceeded retry limit, discarding`);
          }
        }
      }

      // Update pending actions (remove successful, keep failed)
      const remainingActions = failedActions;
      setPendingActions(remainingActions);
      await savePendingActions(remainingActions);

      // Update last sync time
      const syncTime = new Date().toISOString();
      setLastSyncTime(syncTime);
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, syncTime);

      console.log(`Sync completed. ${successfulActionIds.length} successful, ${failedActions.length} failed`);

    } catch (error) {
      console.error('Sync process error:', error);
    } finally {
      setSyncInProgress(false);
    }
  }, [isOnline, syncInProgress, pendingActions, savePendingActions]);

  /**
   * Execute individual offline action
   */
  const executeOfflineAction = async (action: OfflineAction): Promise<void> => {
    const { type, payload } = action;

    switch (type) {
      case 'like':
        await apiService.toggleLike(payload.postId, payload.userId);
        break;
        
      case 'bookmark':
        await apiService.toggleBookmark(payload.postId, payload.userId);
        break;
        
      case 'follow':
        await apiService.toggleFollow(payload.userId, payload.targetUserId);
        break;
        
      case 'share':
        await apiService.sharePost(payload.postId, payload.userId, payload.message);
        break;
        
      case 'comment':
        await apiService.addComment(payload.postId, payload.userId, payload.content);
        break;
        
      case 'post_create':
        await apiService.createPost(payload);
        break;
        
      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  };

  /**
   * Clear all pending actions
   */
  const clearPendingActions = useCallback(async (): Promise<void> => {
    setPendingActions([]);
    await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_ACTIONS);
  }, []);

  /**
   * Get cached data with TTL check
   */
  const getCachedData = useCallback(async (key: string): Promise<any | null> => {
    try {
      const stored = await AsyncStorage.getItem(`cache_${key}`);
      if (!stored) return null;

      const cached = JSON.parse(stored);
      const { data, timestamp, ttl } = cached;

      // Check if cache is expired
      if (ttl && Date.now() - timestamp > ttl) {
        await AsyncStorage.removeItem(`cache_${key}`);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting cached data:', error);
      return null;
    }
  }, []);

  /**
   * Set cached data with TTL
   */
  const setCachedData = useCallback(async (
    key: string, 
    data: any, 
    ttl: number = 30 * 60 * 1000 // 30 minutes default
  ): Promise<void> => {
    try {
      const cached = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(cached));
    } catch (error) {
      console.error('Error setting cached data:', error);
    }
  }, []);

  /**
   * Remove cached data
   */
  const removeCachedData = useCallback(async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.error('Error removing cached data:', error);
    }
  }, []);

  /**
   * Get offline capabilities based on connection status
   */
  const getOfflineCapabilities = useCallback((): OfflineCapabilities => {
    return {
      canLike: true,          // Can queue likes offline
      canBookmark: true,      // Can queue bookmarks offline
      canFollow: true,        // Can queue follows offline
      canShare: !isOnline,    // Can share when online, queue when offline
      canComment: true,       // Can queue comments offline
      canCreatePost: !isOnline, // Can create posts when online, queue when offline
      canViewCached: true,    // Can always view cached content
    };
  }, [isOnline]);

  // Load last sync time on mount
  useEffect(() => {
    const loadLastSync = async () => {
      try {
        const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
        if (lastSync) {
          setLastSyncTime(lastSync);
        }
      } catch (error) {
        console.error('Error loading last sync time:', error);
      }
    };

    loadLastSync();
    loadPendingActions();
  }, [loadPendingActions]);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      const connected = state.isConnected || false;
      
      setIsOnline(online || false);
      setIsConnected(connected);
      setConnectionType(state.type);

      console.log('Network state changed:', {
        isOnline: online,
        isConnected: connected,
        type: state.type,
      });

      // Auto-sync when coming back online
      if (online && pendingActions.length > 0) {
        setTimeout(() => {
          syncPendingActions();
        }, 1000); // Wait 1 second before syncing
      }
    });

    return unsubscribe;
  }, [pendingActions.length, syncPendingActions]);

  return {
    // State
    isOnline,
    isConnected,
    connectionType,
    pendingActions,
    syncInProgress,
    lastSyncTime,

    // Actions
    queueAction,
    syncPendingActions,
    clearPendingActions,
    getCachedData,
    setCachedData,
    removeCachedData,
    getOfflineCapabilities,
  };
};