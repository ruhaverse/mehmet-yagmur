import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ViewStyle,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

interface PostMedia {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
}

interface PostUser {
  id: string;
  name: string;
  username: string;
  image: string;
  isVerified?: boolean;
}

interface Post {
  id: string;
  user: PostUser;
  content: string;
  media?: PostMedia[];
  location?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  type: 'post' | 'reel' | 'swap';
  tags?: string[];
}

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  onPress?: () => void;
  onUserPress?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onMore?: () => void;
  style?: ViewStyle;
}

export default function PostCard({
  post,
  variant = 'default',
  showActions = true,
  onPress,
  onUserPress,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onMore,
  style,
}: PostCardProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const renderPostHeader = () => (
    <View style={styles.postHeader}>
      <TouchableOpacity 
        style={styles.userInfo}
        onPress={onUserPress}
      >
        <Image source={{ uri: post.user.image }} style={styles.userImage} />
        <View style={styles.userDetails}>
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>{post.user.name}</Text>
            {post.user.isVerified && (
              <Text style={styles.verifiedIcon}>✓</Text>
            )}
            {post.type === 'reel' && (
              <View style={styles.reelBadge}>
                <Text style={styles.reelBadgeText}>Reel</Text>
              </View>
            )}
            {post.type === 'swap' && (
              <View style={styles.swapBadge}>
                <Text style={styles.swapBadgeText}>Swap</Text>
              </View>
            )}
          </View>
          <View style={styles.postMeta}>
            <Text style={styles.username}>@{post.user.username}</Text>
            <Text style={styles.timestamp}>• {post.timestamp}</Text>
            {post.location && (
              <>
                <Text style={styles.timestamp}> • </Text>
                <Text style={styles.location}>📍 {post.location}</Text>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.moreButton} onPress={onMore}>
        <Text style={styles.moreIcon}>⋯</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    if (post.media.length === 1) {
      const media = post.media[0];
      return (
        <View style={styles.singleMediaContainer}>
          <Image 
            source={{ uri: media.type === 'video' ? media.thumbnail || media.url : media.url }}
            style={styles.singleMedia}
            resizeMode="cover"
          />
          {media.type === 'video' && (
            <View style={styles.videoOverlay}>
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶️</Text>
              </View>
            </View>
          )}
          {post.type === 'reel' && (
            <View style={styles.reelOverlay}>
              <Text style={styles.reelIcon}>📹</Text>
            </View>
          )}
        </View>
      );
    }

    return (
      <View style={styles.multiMediaContainer}>
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const contentOffset = event.nativeEvent.contentOffset;
            const index = Math.round(contentOffset.x / (width - 32));
            setCurrentMediaIndex(index);
          }}
        >
          {post.media.map((media, index) => (
            <View key={media.id} style={styles.mediaItem}>
              <Image 
                source={{ uri: media.type === 'video' ? media.thumbnail || media.url : media.url }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
              {media.type === 'video' && (
                <View style={styles.videoOverlay}>
                  <View style={styles.playButton}>
                    <Text style={styles.playIcon}>▶️</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
        
        {post.media.length > 1 && (
          <View style={styles.mediaIndicator}>
            {post.media.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  index === currentMediaIndex && styles.indicatorDotActive
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (!post.content && variant === 'compact') return null;
    
    return (
      <View style={styles.contentContainer}>
        {post.content ? (
          <Text 
            style={styles.postContent}
            numberOfLines={variant === 'compact' ? 2 : undefined}
          >
            {post.content}
          </Text>
        ) : null}
        
        {post.tags && post.tags.length > 0 && variant !== 'compact' && (
          <View style={styles.tagsContainer}>
            {post.tags.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderActions = () => {
    if (!showActions) return null;

    return (
      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onLike}
          >
            <Text style={[styles.actionIcon, post.isLiked && styles.likedIcon]}>
              {post.isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={styles.actionCount}>{formatCount(post.likes)}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onComment}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionCount}>{formatCount(post.comments)}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onShare}
          >
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionCount}>{formatCount(post.shares)}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={onBookmark}
        >
          <Text style={[styles.actionIcon, post.isBookmarked && styles.bookmarkedIcon]}>
            {post.isBookmarked ? '🔖' : '🏷️'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: '#ffffff',
      marginVertical: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    };

    if (variant === 'compact') {
      baseStyle.borderRadius = 12;
      baseStyle.marginHorizontal = 16;
      baseStyle.padding = 12;
    } else {
      baseStyle.paddingTop = 16;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity 
      style={[getCardStyle(), style]}
      onPress={onPress}
      activeOpacity={0.98}
    >
      {renderPostHeader()}
      {renderContent()}
      {renderMedia()}
      {renderActions()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  verifiedIcon: {
    fontSize: 14,
    color: '#2196f3',
    marginRight: 8,
  },
  reelBadge: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
  },
  reelBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  swapBadge: {
    backgroundColor: '#9c27b0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
  },
  swapBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  moreButton: {
    padding: 8,
    marginTop: -4,
  },
  moreIcon: {
    fontSize: 16,
    color: '#666',
  },
  contentContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  singleMediaContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  singleMedia: {
    width: '100%',
    height: 300,
  },
  multiMediaContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  mediaItem: {
    width: width - 32,
    height: 300,
    marginHorizontal: 16,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 20,
    marginLeft: 4,
  },
  reelOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  reelIcon: {
    fontSize: 12,
  },
  mediaIndicator: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorDotActive: {
    backgroundColor: '#ffffff',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  leftActions: {
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  likedIcon: {
    color: '#f44336',
  },
  actionCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  bookmarkButton: {
    padding: 4,
  },
  bookmarkedIcon: {
    color: '#ff9800',
  },
});