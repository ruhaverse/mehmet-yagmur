// Notifications Hook
// Powers notification system with smart backend without UI changes

import { useState, useEffect, useCallback } from 'react';
import { realTimeService } from '../services/realtime.service';
import { apiService } from '../services/api.service';
import { Notification } from '../types/post.types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  lastFetched: string | null;
}

interface NotificationActions {
  fetchNotifications: (page?: number) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  subscribeToRealTime: () => void;
  unsubscribeFromRealTime: () => void;
}

interface NotificationSettings {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  messages: boolean;
  challenges: boolean;
  timeReminders: boolean;
  mentions: boolean;
  pushEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export const useNotifications = (userId: string): NotificationState & NotificationActions => {
  // State management
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Fetch notifications from API
   */
  const fetchNotifications = useCallback(async (page: number = 1): Promise<void> => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      // Mock API call - in production this would be a real API endpoint
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'like',
          user: {
            id: 'user_2',
            name: 'John Doe',
            profilePicture: 'https://picsum.photos/40/40?random=6',
            isVerified: true,
          },
          post: {
            id: 'post_1',
            user: {
              id: userId,
              name: 'You',
              profilePicture: '',
              isVerified: false,
            },
            content: 'Your post content...',
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: 0,
            shares: 0,
            isLiked: false,
            isBookmarked: false,
            type: 'post',
          },
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          isRead: false,
          content: 'liked your post',
        },
        {
          id: '2',
          type: 'follow',
          user: {
            id: 'user_3',
            name: 'Sarah Smith',
            profilePicture: 'https://picsum.photos/40/40?random=7',
            isVerified: false,
          },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          isRead: false,
          content: 'started following you',
        },
        {
          id: '3',
          type: 'comment',
          user: {
            id: 'user_4',
            name: 'Mike Johnson',
            profilePicture: 'https://picsum.photos/40/40?random=8',
            isVerified: true,
          },
          post: {
            id: 'post_2',
            user: {
              id: userId,
              name: 'You',
              profilePicture: '',
              isVerified: false,
            },
            content: 'Another post...',
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: 0,
            shares: 0,
            isLiked: false,
            isBookmarked: false,
            type: 'post',
          },
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          isRead: true,
          content: 'commented on your post',
        },
      ];

      // Simulate pagination
      const startIndex = (page - 1) * 20;
      const pageNotifications = mockNotifications.slice(startIndex, startIndex + 20);

      if (page === 1) {
        setNotifications(pageNotifications);
      } else {
        setNotifications(prev => [...prev, ...pageNotifications]);
      }

      // Update pagination state
      setHasMore(pageNotifications.length === 20);
      setCurrentPage(page);

      // Update unread count
      const unread = pageNotifications.filter(n => !n.isRead).length;
      if (page === 1) {
        setUnreadCount(unread);
      } else {
        setUnreadCount(prev => prev + unread);
      }

      setLastFetched(new Date().toISOString());

    } catch (error) {
      console.error('Fetch notifications error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [loading, userId]);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback(async (notificationId: string): Promise<void> => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      ));

      // Update unread count
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      // API call would go here
      console.log('Marking notification as read:', notificationId);

    } catch (error) {
      console.error('Mark as read error:', error);
    }
  }, [notifications]);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async (): Promise<void> => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(notification => ({ 
        ...notification, 
        isRead: true 
      })));
      setUnreadCount(0);

      // API call would go here
      console.log('Marking all notifications as read');

    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  }, []);

  /**
   * Delete notification
   */
  const deleteNotification = useCallback(async (notificationId: string): Promise<void> => {
    try {
      // Optimistic update
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));

      // Update unread count if notification was unread
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      // API call would go here
      console.log('Deleting notification:', notificationId);

    } catch (error) {
      console.error('Delete notification error:', error);
    }
  }, [notifications]);

  /**
   * Clear all notifications
   */
  const clearAllNotifications = useCallback(async (): Promise<void> => {
    try {
      setNotifications([]);
      setUnreadCount(0);

      // API call would go here
      console.log('Clearing all notifications');

    } catch (error) {
      console.error('Clear all notifications error:', error);
    }
  }, []);

  /**
   * Refresh notifications (pull-to-refresh)
   */
  const refreshNotifications = useCallback(async (): Promise<void> => {
    setCurrentPage(1);
    setHasMore(true);
    await fetchNotifications(1);
  }, [fetchNotifications]);

  /**
   * Subscribe to real-time notifications
   */
  const subscribeToRealTime = useCallback((): void => {
    const handleNewNotification = (notification: Notification) => {
      // Add new notification to the top of the list
      setNotifications(prev => [notification, ...prev]);
      
      // Increment unread count if notification is unread
      if (!notification.isRead) {
        setUnreadCount(prev => prev + 1);
      }

      // Show system notification if enabled
      showSystemNotification(notification);
    };

    // Subscribe to real-time events
    realTimeService.on('notification', handleNewNotification);
  }, []);

  /**
   * Unsubscribe from real-time notifications
   */
  const unsubscribeFromRealTime = useCallback((): void => {
    // This would remove event listeners
    console.log('Unsubscribing from real-time notifications');
  }, []);

  /**
   * Show system notification (push notification)
   */
  const showSystemNotification = useCallback((notification: Notification): void => {
    // This would trigger push notification
    console.log('System notification:', notification.content);
    
    // In production, this would use:
    // - React Native Push Notification
    // - Expo Notifications
    // - Firebase Cloud Messaging
  }, []);

  /**
   * Get notification settings
   */
  const getNotificationSettings = useCallback(async (): Promise<NotificationSettings> => {
    // This would fetch from API or local storage
    return {
      likes: true,
      comments: true,
      follows: true,
      messages: true,
      challenges: true,
      timeReminders: true,
      mentions: true,
      pushEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
    };
  }, []);

  /**
   * Update notification settings
   */
  const updateNotificationSettings = useCallback(async (settings: Partial<NotificationSettings>): Promise<void> => {
    try {
      // API call to update settings
      console.log('Updating notification settings:', settings);
    } catch (error) {
      console.error('Update notification settings error:', error);
    }
  }, []);

  /**
   * Load more notifications (pagination)
   */
  const loadMoreNotifications = useCallback(async (): Promise<void> => {
    if (hasMore && !loading) {
      await fetchNotifications(currentPage + 1);
    }
  }, [hasMore, loading, currentPage, fetchNotifications]);

  // Initialize notifications on mount
  useEffect(() => {
    if (userId) {
      fetchNotifications(1);
      subscribeToRealTime();
    }

    // Cleanup on unmount
    return () => {
      unsubscribeFromRealTime();
    };
  }, [userId]); // Only depend on userId

  // Auto-refresh notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchNotifications(1);
      }
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(interval);
  }, [loading, fetchNotifications]);

  return {
    // State
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    lastFetched,

    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    refreshNotifications,
    subscribeToRealTime,
    unsubscribeFromRealTime,
  };
};