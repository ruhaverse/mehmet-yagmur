import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  ImageBackground,
} from 'react-native';

interface Story {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  mediaUrl: string;
  mediaType: 'photo' | 'video';
  timestamp: string;
  isViewed: boolean;
  isOwn?: boolean;
}

interface StoryCardProps {
  story?: Story;
  variant?: 'default' | 'compact' | 'add';
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  onLongPress?: () => void;
  showLabel?: boolean;
  style?: ViewStyle;
}

export default function StoryCard({
  story,
  variant = 'default',
  size = 'medium',
  onPress,
  onLongPress,
  showLabel = true,
  style,
}: StoryCardProps) {
  const getContainerSize = () => {
    switch (size) {
      case 'small':
        return { width: 60, height: 60 };
      case 'large':
        return { width: 100, height: 100 };
      default:
        return { width: 80, height: 80 };
    }
  };

  const getLabelStyle = () => {
    return {
      fontSize: size === 'small' ? 10 : size === 'large' ? 14 : 12,
      maxWidth: size === 'small' ? 60 : size === 'large' ? 100 : 80,
    };
  };

  const renderAddStory = () => (
    <TouchableOpacity 
      style={[styles.storyContainer, getContainerSize(), style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.addStoryContent, getContainerSize()]}>
        <View style={styles.addIconContainer}>
          <Text style={styles.addIcon}>+</Text>
        </View>
      </View>
      {showLabel && (
        <Text style={[styles.storyLabel, getLabelStyle()]} numberOfLines={1}>
          Your Story
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderStory = () => {
    if (!story) return null;

    const containerSize = getContainerSize();
    const borderWidth = size === 'small' ? 2 : size === 'large' ? 4 : 3;
    
    return (
      <TouchableOpacity 
        style={[styles.storyContainer, style]}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.8}
      >
        <View style={[
          styles.storyBorder,
          {
            width: containerSize.width + (borderWidth * 2),
            height: containerSize.height + (borderWidth * 2),
            borderRadius: (containerSize.width + (borderWidth * 2)) / 2,
            borderWidth: borderWidth,
            borderColor: story.isViewed ? '#e0e0e0' : '#2196f3',
          }
        ]}>
          <ImageBackground
            source={{ uri: story.mediaUrl }}
            style={[styles.storyContent, containerSize]}
            imageStyle={{ borderRadius: containerSize.width / 2 }}
          >
            {story.mediaType === 'video' && (
              <View style={styles.videoIndicator}>
                <Text style={styles.videoIcon}>▶️</Text>
              </View>
            )}
            
            {story.isOwn && (
              <View style={styles.ownStoryIndicator}>
                <Text style={styles.ownStoryIcon}>👁️</Text>
              </View>
            )}
          </ImageBackground>
        </View>
        
        {showLabel && (
          <Text style={[
            styles.storyLabel, 
            getLabelStyle(),
            story.isViewed && styles.viewedLabel
          ]} numberOfLines={1}>
            {story.isOwn ? 'Your Story' : story.userName}
          </Text>
        )}
        
        {variant === 'default' && !story.isViewed && (
          <View style={styles.unreadIndicator} />
        )}
      </TouchableOpacity>
    );
  };

  if (variant === 'add') {
    return renderAddStory();
  }

  return renderStory();
}

const styles = StyleSheet.create({
  storyContainer: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  storyBorder: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  storyContent: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  addStoryContent: {
    backgroundColor: '#f0f0f0',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  addIconContainer: {
    backgroundColor: '#2196f3',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  videoIndicator: {
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
  videoIcon: {
    fontSize: 8,
  },
  ownStoryIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownStoryIcon: {
    fontSize: 8,
  },
  storyLabel: {
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 6,
  },
  viewedLabel: {
    color: '#999',
  },
  unreadIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff4444',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});