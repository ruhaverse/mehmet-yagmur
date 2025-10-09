import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';

type NotificationType = 
  | 'like' 
  | 'comment' 
  | 'follow' 
  | 'mention' 
  | 'share' 
  | 'friend_request' 
  | 'friend_accept'
  | 'group_invite'
  | 'swap_request'
  | 'swap_accept'
  | 'story_view'
  | 'live_start';

interface NotificationData {
  id: string;
  type: NotificationType;
  fromUser: {
    id: string;
    name: string;
    username: string;
    image: string;
    isVerified?: boolean;
  };
  targetContent?: {
    id: string;
    type: 'post' | 'story' | 'comment' | 'group' | 'swap';
    thumbnail?: string;
    title?: string;
  };
  message?: string;
  timestamp: string;
  isRead: boolean;
  isNew?: boolean;
}

interface NotificationItemProps {
  notification: NotificationData;
  onPress?: () => void;
  onUserPress?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  variant?: 'default' | 'compact';
  style?: ViewStyle;
}

export default function NotificationItem({
  notification,
  onPress,
  onUserPress,
  onAccept,
  onDecline,
  variant = 'default',
  style,
}: NotificationItemProps) {
  const getNotificationIcon = (type: NotificationType): string => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      case 'mention':
        return '@';
      case 'share':
        return '📤';
      case 'friend_request':
        return '👥';
      case 'friend_accept':
        return '✅';
      case 'group_invite':
        return '👥';
      case 'swap_request':
        return '🔄';
      case 'swap_accept':
        return '✅';
      case 'story_view':
        return '👁️';
      case 'live_start':
        return '📹';
      default:
        return '🔔';
    }
  };

  const getNotificationMessage = (): string => {
    if (notification.message) {
      return notification.message;
    }

    const userName = notification.fromUser.name;
    
    switch (notification.type) {
      case 'like':
        return `${userName} liked your ${notification.targetContent?.type || 'post'}`;
      case 'comment':
        return `${userName} commented on your ${notification.targetContent?.type || 'post'}`;
      case 'follow':
        return `${userName} started following you`;
      case 'mention':
        return `${userName} mentioned you in a ${notification.targetContent?.type || 'post'}`;
      case 'share':
        return `${userName} shared your ${notification.targetContent?.type || 'post'}`;
      case 'friend_request':
        return `${userName} sent you a friend request`;
      case 'friend_accept':
        return `${userName} accepted your friend request`;
      case 'group_invite':
        return `${userName} invited you to join ${notification.targetContent?.title || 'a group'}`;
      case 'swap_request':
        return `${userName} wants to swap with you`;
      case 'swap_accept':
        return `${userName} accepted your swap request`;
      case 'story_view':
        return `${userName} viewed your story`;
      case 'live_start':
        return `${userName} started a live video`;
      default:
        return `${userName} sent you a notification`;
    }
  };

  const getNotificationColor = (type: NotificationType): string => {
    switch (type) {
      case 'like':
        return '#f44336';
      case 'comment':
        return '#2196f3';
      case 'follow':
        return '#4caf50';
      case 'mention':
        return '#ff9800';
      case 'share':
        return '#9c27b0';
      case 'friend_request':
      case 'friend_accept':
        return '#4caf50';
      case 'group_invite':
        return '#607d8b';
      case 'swap_request':
      case 'swap_accept':
        return '#e91e63';
      case 'story_view':
        return '#673ab7';
      case 'live_start':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const showActionButtons = () => {
    return notification.type === 'friend_request' || 
           notification.type === 'group_invite' ||
           notification.type === 'swap_request';
  };

  const renderUserImage = () => (
    <TouchableOpacity onPress={onUserPress}>
      <View style={styles.userImageContainer}>
        <Image 
          source={{ uri: notification.fromUser.image }} 
          style={styles.userImage} 
        />
        {notification.fromUser.isVerified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedIcon}>✓</Text>
          </View>
        )}
        <View style={[
          styles.notificationBadge,
          { backgroundColor: getNotificationColor(notification.type) }
        ]}>
          <Text style={styles.notificationIcon}>
            {getNotificationIcon(notification.type)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.messageContainer}>
        <Text style={[
          styles.notificationMessage,
          !notification.isRead && styles.unreadMessage,
          variant === 'compact' && styles.compactMessage
        ]} numberOfLines={variant === 'compact' ? 2 : 3}>
          {getNotificationMessage()}
        </Text>
        <Text style={styles.timestamp}>{notification.timestamp}</Text>
      </View>
      
      {showActionButtons() && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.acceptButton}
            onPress={onAccept}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.declineButton}
            onPress={onDecline}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderThumbnail = () => {
    if (!notification.targetContent?.thumbnail) return null;

    return (
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: notification.targetContent.thumbnail }}
          style={styles.thumbnail}
        />
        {notification.targetContent.type === 'story' && (
          <View style={styles.storyIndicator}>
            <Text style={styles.storyIcon}>📱</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        !notification.isRead && styles.unreadContainer,
        notification.isNew && styles.newContainer,
        variant === 'compact' && styles.compactContainer,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {notification.isNew && <View style={styles.newIndicator} />}
      
      {renderUserImage()}
      {renderContent()}
      {renderThumbnail()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  compactContainer: {
    paddingVertical: 8,
  },
  unreadContainer: {
    backgroundColor: '#f8f9ff',
  },
  newContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  newIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f44336',
  },
  userImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  userImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  verifiedBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#2196f3',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  verifiedIcon: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  notificationBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  notificationIcon: {
    fontSize: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  messageContainer: {
    marginBottom: 8,
  },
  notificationMessage: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  compactMessage: {
    fontSize: 14,
    lineHeight: 18,
  },
  unreadMessage: {
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  declineButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  thumbnailContainer: {
    position: 'relative',
    marginLeft: 12,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  storyIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyIcon: {
    fontSize: 8,
  },
});