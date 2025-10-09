import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';

interface User {
  id: string;
  name: string;
  username: string;
  image: string;
  isVerified?: boolean;
  isOnline?: boolean;
  bio?: string;
  location?: string;
  mutualFriends?: number;
  followersCount?: number;
  isFollowing?: boolean;
  isFriend?: boolean;
}

interface UserCardProps {
  user: User;
  variant?: 'default' | 'compact' | 'detailed' | 'suggestion';
  onPress?: () => void;
  onFollowPress?: () => void;
  onMessagePress?: () => void;
  showActions?: boolean;
  showMutualFriends?: boolean;
  showBio?: boolean;
  showLocation?: boolean;
  showOnlineStatus?: boolean;
  style?: ViewStyle;
}

export default function UserCard({
  user,
  variant = 'default',
  onPress,
  onFollowPress,
  onMessagePress,
  showActions = true,
  showMutualFriends = true,
  showBio = false,
  showLocation = false,
  showOnlineStatus = true,
  style,
}: UserCardProps) {
  const getImageSize = () => {
    switch (variant) {
      case 'compact':
        return 40;
      case 'detailed':
        return 70;
      case 'suggestion':
        return 60;
      default:
        return 50;
    }
  };

  const renderUserImage = () => {
    const imageSize = getImageSize();
    
    return (
      <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
        <Image 
          source={{ uri: user.image }} 
          style={[styles.userImage, { width: imageSize, height: imageSize, borderRadius: imageSize / 2 }]}
        />
        
        {user.isVerified && (
          <View style={[styles.verifiedBadge, getVerifiedBadgePosition()]}>
            <Text style={styles.verifiedIcon}>✓</Text>
          </View>
        )}
        
        {showOnlineStatus && user.isOnline && (
          <View style={[styles.onlineBadge, getOnlineBadgePosition()]}>
          </View>
        )}
      </View>
    );
  };

  const getVerifiedBadgePosition = () => {
    const imageSize = getImageSize();
    const badgeSize = imageSize > 50 ? 20 : 16;
    
    return {
      bottom: -2,
      right: -2,
      width: badgeSize,
      height: badgeSize,
      borderRadius: badgeSize / 2,
    };
  };

  const getOnlineBadgePosition = () => {
    const imageSize = getImageSize();
    const badgeSize = imageSize > 50 ? 16 : 12;
    
    return {
      top: 2,
      right: 2,
      width: badgeSize,
      height: badgeSize,
      borderRadius: badgeSize / 2,
    };
  };

  const renderUserInfo = () => {
    return (
      <View style={styles.userInfo}>
        <View style={styles.nameContainer}>
          <Text style={[
            styles.userName,
            variant === 'compact' && styles.userNameCompact,
            variant === 'detailed' && styles.userNameDetailed
          ]}>
            {user.name}
          </Text>
        </View>
        
        <Text style={[
          styles.userHandle,
          variant === 'compact' && styles.userHandleCompact
        ]}>
          @{user.username}
        </Text>

        {showBio && user.bio && variant !== 'compact' && (
          <Text style={styles.userBio} numberOfLines={2}>
            {user.bio}
          </Text>
        )}

        {showLocation && user.location && variant !== 'compact' && (
          <Text style={styles.userLocation}>
            📍 {user.location}
          </Text>
        )}

        {showMutualFriends && user.mutualFriends && user.mutualFriends > 0 && variant !== 'compact' && (
          <Text style={styles.mutualFriends}>
            {user.mutualFriends} mutual friend{user.mutualFriends > 1 ? 's' : ''}
          </Text>
        )}

        {variant === 'detailed' && user.followersCount && (
          <Text style={styles.followersCount}>
            {user.followersCount.toLocaleString()} followers
          </Text>
        )}
      </View>
    );
  };

  const renderActions = () => {
    if (!showActions || variant === 'compact') return null;

    return (
      <View style={styles.actionsContainer}>
        {user.isFriend ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.friendButton}
              onPress={onMessagePress}
            >
              <Text style={styles.friendButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.followButton,
                user.isFollowing && styles.followingButton
              ]}
              onPress={onFollowPress}
            >
              <Text style={[
                styles.followButtonText,
                user.isFollowing && styles.followingButtonText
              ]}>
                {user.isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            
            {variant === 'detailed' && (
              <TouchableOpacity
                style={styles.messageButton}
                onPress={onMessagePress}
              >
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: variant === 'compact' ? 12 : 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    };

    if (variant === 'suggestion') {
      baseStyle.alignItems = 'center';
      baseStyle.minWidth = 160;
    }

    return baseStyle;
  };

  if (variant === 'suggestion') {
    return (
      <TouchableOpacity 
        style={[getCardStyle(), styles.suggestionCard, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {renderUserImage()}
        <View style={styles.suggestionInfo}>
          <Text style={styles.suggestionName} numberOfLines={1}>
            {user.name}
          </Text>
          <Text style={styles.suggestionHandle} numberOfLines={1}>
            @{user.username}
          </Text>
          {showMutualFriends && user.mutualFriends && user.mutualFriends > 0 && (
            <Text style={styles.suggestionMutual} numberOfLines={1}>
              {user.mutualFriends} mutual
            </Text>
          )}
        </View>
        {renderActions()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[getCardStyle(), style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[
        styles.cardContent,
        variant === 'detailed' && styles.cardContentDetailed
      ]}>
        {renderUserImage()}
        {renderUserInfo()}
        {renderActions()}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  userImage: {
    backgroundColor: '#f0f0f0',
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  verifiedIcon: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  onlineBadge: {
    position: 'absolute',
    backgroundColor: '#4caf50',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContentDetailed: {
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userNameCompact: {
    fontSize: 14,
  },
  userNameDetailed: {
    fontSize: 18,
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userHandleCompact: {
    fontSize: 12,
    marginBottom: 0,
  },
  userBio: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 6,
  },
  userLocation: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  mutualFriends: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  followersCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  actionsContainer: {
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  followButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  followingButton: {
    backgroundColor: '#e0e0e0',
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#666',
  },
  friendButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  friendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2196f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  messageButtonText: {
    color: '#2196f3',
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionCard: {
    alignItems: 'center',
    padding: 16,
  },
  suggestionInfo: {
    alignItems: 'center',
    marginVertical: 12,
    minHeight: 60,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  suggestionHandle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  suggestionMutual: {
    fontSize: 11,
    color: '#888',
  },
});