import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'message' | 'post_share' | 'story_like' | 'friend_request' | 'group_invite' | 'swap_offer' | 'system';
  userId?: string;
  userName?: string;
  userImage?: string;
  postId?: string;
  postImage?: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired?: boolean;
  requestId?: string;
  groupId?: string;
  swapId?: string;
}

type NotificationFilter = 'all' | 'unread' | 'mentions' | 'follows' | 'posts';

export default function NotificationScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Mock notifications data
    setNotifications([
      {
        id: 'notif1',
        type: 'like',
        userId: 'user1',
        userName: 'sarah_photo',
        userImage: 'https://picsum.photos/100/100?random=201',
        postId: 'post1',
        postImage: 'https://picsum.photos/100/100?random=301',
        message: 'liked your photo',
        timestamp: '2024-01-15T10:30:00Z',
        isRead: false,
      },
      {
        id: 'notif2',
        type: 'comment',
        userId: 'user2',
        userName: 'alex_traveler',
        userImage: 'https://picsum.photos/100/100?random=202',
        postId: 'post2',
        postImage: 'https://picsum.photos/100/100?random=302',
        message: 'commented on your post: "Amazing shot! Where was this taken?"',
        timestamp: '2024-01-15T09:45:00Z',
        isRead: false,
      },
      {
        id: 'notif3',
        type: 'follow',
        userId: 'user3',
        userName: 'photography_pro',
        userImage: 'https://picsum.photos/100/100?random=203',
        message: 'started following you',
        timestamp: '2024-01-15T08:20:00Z',
        isRead: true,
      },
      {
        id: 'notif4',
        type: 'friend_request',
        userId: 'user4',
        userName: 'john_creator',
        userImage: 'https://picsum.photos/100/100?random=204',
        message: 'sent you a friend request',
        timestamp: '2024-01-14T19:30:00Z',
        isRead: false,
        actionRequired: true,
        requestId: 'req1',
      },
      {
        id: 'notif5',
        type: 'mention',
        userId: 'user5',
        userName: 'design_studio',
        userImage: 'https://picsum.photos/100/100?random=205',
        postId: 'post5',
        postImage: 'https://picsum.photos/100/100?random=305',
        message: 'mentioned you in a comment',
        timestamp: '2024-01-14T17:15:00Z',
        isRead: true,
      },
      {
        id: 'notif6',
        type: 'story_like',
        userId: 'user6',
        userName: 'travel_diary',
        userImage: 'https://picsum.photos/100/100?random=206',
        message: 'liked your story',
        timestamp: '2024-01-14T16:45:00Z',
        isRead: true,
      },
      {
        id: 'notif7',
        type: 'post_share',
        userId: 'user7',
        userName: 'art_lover',
        userImage: 'https://picsum.photos/100/100?random=207',
        postId: 'post7',
        postImage: 'https://picsum.photos/100/100?random=307',
        message: 'shared your post to their story',
        timestamp: '2024-01-14T15:20:00Z',
        isRead: true,
      },
      {
        id: 'notif8',
        type: 'group_invite',
        userId: 'user8',
        userName: 'community_mod',
        userImage: 'https://picsum.photos/100/100?random=208',
        groupId: 'group1',
        message: 'invited you to join "Photography Enthusiasts" group',
        timestamp: '2024-01-14T14:10:00Z',
        isRead: false,
        actionRequired: true,
      },
      {
        id: 'notif9',
        type: 'swap_offer',
        userId: 'user9',
        userName: 'tech_trader',
        userImage: 'https://picsum.photos/100/100?random=209',
        swapId: 'swap1',
        message: 'sent you a swap offer for your iPhone',
        timestamp: '2024-01-14T13:30:00Z',
        isRead: false,
        actionRequired: true,
      },
      {
        id: 'notif10',
        type: 'message',
        userId: 'user10',
        userName: 'chat_friend',
        userImage: 'https://picsum.photos/100/100?random=210',
        message: 'sent you a message',
        timestamp: '2024-01-14T12:45:00Z',
        isRead: true,
      },
      {
        id: 'notif11',
        type: 'system',
        message: 'Your profile verification has been approved! You now have a verified badge.',
        timestamp: '2024-01-14T10:00:00Z',
        isRead: false,
      },
      {
        id: 'notif12',
        type: 'like',
        userId: 'user12',
        userName: 'photo_enthusiast',
        userImage: 'https://picsum.photos/100/100?random=212',
        postId: 'post12',
        postImage: 'https://picsum.photos/100/100?random=312',
        message: 'and 15 others liked your photo',
        timestamp: '2024-01-13T22:30:00Z',
        isRead: true,
      },
    ]);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    switch (activeFilter) {
      case 'unread':
        return !notification.isRead;
      case 'mentions':
        return notification.type === 'mention';
      case 'follows':
        return notification.type === 'follow' || notification.type === 'friend_request';
      case 'posts':
        return ['like', 'comment', 'post_share', 'story_like'].includes(notification.type);
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);

    // Navigate based on notification type
    switch (notification.type) {
      case 'like':
      case 'comment':
      case 'post_share':
        if (notification.postId) {
          navigation.navigate('PostDetailScreen', { postId: notification.postId });
        }
        break;
      case 'follow':
        if (notification.userId) {
          navigation.navigate('ProfileScreen', { userId: notification.userId });
        }
        break;
      case 'friend_request':
        navigation.navigate('ReceivedRequestsScreen');
        break;
      case 'mention':
        if (notification.postId) {
          navigation.navigate('PostDetailScreen', { postId: notification.postId });
        }
        break;
      case 'message':
        if (notification.userId) {
          navigation.navigate('ChatScreen', { userId: notification.userId });
        }
        break;
      case 'group_invite':
        if (notification.groupId) {
          navigation.navigate('GroupScreen', { groupId: notification.groupId });
        }
        break;
      case 'swap_offer':
        if (notification.swapId) {
          navigation.navigate('SwapHistoryScreen');
        }
        break;
      case 'story_like':
        navigation.navigate('StoryViewScreen');
        break;
    }
  };

  const handleAcceptFriendRequest = (requestId: string, notificationId: string) => {
    // Mock API call
    Alert.alert('Success', 'Friend request accepted!');
    // Remove notification or update it
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const handleDeclineFriendRequest = (requestId: string, notificationId: string) => {
    Alert.alert('Declined', 'Friend request declined.');
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const handleAcceptGroupInvite = (groupId: string, notificationId: string) => {
    Alert.alert('Success', 'Joined the group!');
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const handleDeclineGroupInvite = (groupId: string, notificationId: string) => {
    Alert.alert('Declined', 'Group invitation declined.');
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const formatTime = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w`;
  };

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'friend_request': return '👥';
      case 'mention': return '@';
      case 'message': return '💌';
      case 'post_share': return '📤';
      case 'story_like': return '👁️';
      case 'group_invite': return '🏪';
      case 'swap_offer': return '🔄';
      case 'system': return '🔔';
      default: return '📱';
    }
  };

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.isRead && styles.unreadNotification,
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={styles.notificationLeft}>
        {/* User Image or Icon */}
        {notification.userImage ? (
          <View style={styles.avatarContainer}>
            <Image source={{ uri: notification.userImage }} style={styles.userAvatar} />
            <View style={styles.notificationIconBadge}>
              <Text style={styles.notificationIconText}>
                {getNotificationIcon(notification.type)}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.systemIcon}>
            <Text style={styles.systemIconText}>
              {getNotificationIcon(notification.type)}
            </Text>
          </View>
        )}

        {/* Notification Content */}
        <View style={styles.notificationContent}>
          <Text style={styles.notificationMessage}>
            {notification.userName && (
              <Text style={styles.userName}>{notification.userName} </Text>
            )}
            {notification.message}
          </Text>
          <Text style={styles.notificationTime}>
            {formatTime(notification.timestamp)}
          </Text>
        </View>
      </View>

      {/* Post Image */}
      {notification.postImage && (
        <Image source={{ uri: notification.postImage }} style={styles.postThumbnail} />
      )}

      {/* Unread Indicator */}
      {!notification.isRead && <View style={styles.unreadDot} />}

      {/* Action Buttons */}
      {notification.actionRequired && (
        <View style={styles.actionButtons}>
          {notification.type === 'friend_request' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => handleAcceptFriendRequest(notification.requestId!, notification.id)}
              >
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.declineButton]}
                onPress={() => handleDeclineFriendRequest(notification.requestId!, notification.id)}
              >
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
            </>
          )}

          {notification.type === 'group_invite' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => handleAcceptGroupInvite(notification.groupId!, notification.id)}
              >
                <Text style={styles.acceptButtonText}>Join</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.declineButton]}
                onPress={() => handleDeclineGroupInvite(notification.groupId!, notification.id)}
              >
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
            </>
          )}

          {notification.type === 'swap_offer' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.viewButton]}
              onPress={() => navigation.navigate('SwapCheckoutScreen', { swapId: notification.swapId })}
            >
              <Text style={styles.viewButtonText}>View Offer</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity 
              style={styles.markAllButton}
              onPress={markAllAsRead}
            >
              <Text style={styles.markAllButtonText}>Mark all read</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
            <Text style={styles.settingsButton}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'follows', label: 'Follows', count: notifications.filter(n => ['follow', 'friend_request'].includes(n.type)).length },
            { key: 'posts', label: 'Posts', count: notifications.filter(n => ['like', 'comment', 'post_share', 'story_like'].includes(n.type)).length },
            { key: 'mentions', label: 'Mentions', count: notifications.filter(n => n.type === 'mention').length },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                activeFilter === filter.key && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilter(filter.key as NotificationFilter)}
            >
              <Text style={[
                styles.filterTabText,
                activeFilter === filter.key && styles.activeFilterTabText
              ]}>
                {filter.label}
              </Text>
              {filter.count > 0 && (
                <View style={[
                  styles.filterTabBadge,
                  activeFilter === filter.key && styles.activeFilterTabBadge
                ]}>
                  <Text style={[
                    styles.filterTabBadgeText,
                    activeFilter === filter.key && styles.activeFilterTabBadgeText
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔔</Text>
            <Text style={styles.emptyStateTitle}>No notifications</Text>
            <Text style={styles.emptyStateMessage}>
              {activeFilter === 'all' 
                ? "You're all caught up! We'll let you know when there's something new."
                : `No ${activeFilter} notifications to show.`
              }
            </Text>
          </View>
        ) : (
          filteredNotifications.map(renderNotification)
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
  },
  markAllButtonText: {
    fontSize: 14,
    color: '#2196f3',
    fontWeight: '500',
  },
  settingsButton: {
    fontSize: 20,
    padding: 4,
  },
  filterTabs: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeFilterTab: {
    backgroundColor: '#2196f3',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#ffffff',
  },
  filterTabBadge: {
    backgroundColor: '#ff4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  activeFilterTabBadge: {
    backgroundColor: '#ffffff',
  },
  filterTabBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  activeFilterTabBadgeText: {
    color: '#2196f3',
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadNotification: {
    backgroundColor: '#f8fdff',
  },
  notificationLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  notificationIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  notificationIconText: {
    fontSize: 10,
  },
  systemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  systemIconText: {
    fontSize: 20,
  },
  notificationContent: {
    flex: 1,
    paddingRight: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  postThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 6,
    marginLeft: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196f3',
    marginLeft: 8,
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 6,
    marginLeft: 8,
    alignItems: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4caf50',
  },
  acceptButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  declineButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  declineButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  viewButton: {
    backgroundColor: '#2196f3',
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 20,
  },
});