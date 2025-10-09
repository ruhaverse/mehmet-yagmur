// Animated Feeling System - Emoji-based replacement for GIFs
// Modern animated emoji system with spring animations

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

// Feeling definitions with animated emojis
export const FEELINGS_DATA = [
  {
    type: 'Feeling',
    name: 'Feeling Happy',
    emoji: '😊',
    animatedEmoji: ['😊', '😄', '😆'],
    color: '#FFD700',
  },
  {
    type: 'Feeling',
    name: 'Feeling In Love',
    emoji: '🥰',
    animatedEmoji: ['🥰', '😍', '💕'],
    color: '#FF69B4',
  },
  {
    type: 'Feeling',
    name: 'Feeling Sad',
    emoji: '😢',
    animatedEmoji: ['😢', '😭', '💧'],
    color: '#4169E1',
  },
  {
    type: 'Feeling',
    name: 'Feeling Blessed',
    emoji: '😇',
    animatedEmoji: ['😇', '🙏', '✨'],
    color: '#FFE4B5',
  },
  {
    type: 'Feeling',
    name: 'Feeling Loved',
    emoji: '💖',
    animatedEmoji: ['💖', '💝', '💗'],
    color: '#FF1493',
  },
  {
    type: 'Feeling',
    name: 'Feeling Angry',
    emoji: '😠',
    animatedEmoji: ['😠', '😡', '🔥'],
    color: '#FF4500',
  },
  {
    type: 'Feeling',
    name: 'Feeling Cool',
    emoji: '😎',
    animatedEmoji: ['😎', '🕶️', '⭐'],
    color: '#00CED1',
  },
  {
    type: 'Feeling',
    name: 'Feeling Funny',
    emoji: '🤣',
    animatedEmoji: ['🤣', '😂', '😆'],
    color: '#FF6347',
  },
];

// Activities data
export const ACTIVITIES_DATA = [
  {
    type: 'activity',
    name: 'Eating',
    emoji: '🍽️',
    icon: 'silverware',
    color: '#FF6B35',
  },
  {
    type: 'activity', 
    name: 'Drinking',
    emoji: '🥤',
    icon: 'cup',
    color: '#4ECDC4',
  },
  {
    type: 'activity',
    name: 'Listening to',
    emoji: '🎵',
    icon: 'music',
    color: '#45B7D1',
  },
  {
    type: 'activity',
    name: 'Watching',
    emoji: '📺',
    icon: 'television',
    color: '#96CEB4',
  },
  {
    type: 'activity',
    name: 'Reading',
    emoji: '📖',
    icon: 'book-open-variant',
    color: '#FFEAA7',
  },
  {
    type: 'activity',
    name: 'Playing',
    emoji: '🎮',
    icon: 'gamepad-variant',
    color: '#DDA0DD',
  },
  {
    type: 'activity',
    name: 'Working on',
    emoji: '💻',
    icon: 'laptop',
    color: '#74B9FF',
  },
  {
    type: 'activity',
    name: 'Traveling to',
    emoji: '✈️',
    icon: 'airplane',
    color: '#FD79A8',
  },
];

interface AnimatedFeelingProps {
  feeling: typeof FEELINGS_DATA[0];
  size?: number;
  animate?: boolean;
}

export const AnimatedFeeling: React.FC<AnimatedFeelingProps> = ({ 
  feeling, 
  size = 50, 
  animate = true 
}) => {
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const scaleValue = new Animated.Value(1);
  const rotationValue = new Animated.Value(0);

  useEffect(() => {
    if (!animate) return;

    const animateEmoji = () => {
      // Scale animation
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
      ]).start();

      // Rotation animation for certain emojis
      if (feeling.name.includes('Love') || feeling.name.includes('Happy')) {
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          rotationValue.setValue(0);
        });
      }
    };

    // Emoji cycling
    const emojiInterval = setInterval(() => {
      setCurrentEmojiIndex((prev) => 
        (prev + 1) % feeling.animatedEmoji.length
      );
    }, 1500);

    // Animation interval
    const animationInterval = setInterval(animateEmoji, 3000);
    
    // Initial animation
    animateEmoji();

    return () => {
      clearInterval(emojiInterval);
      clearInterval(animationInterval);
    };
  }, [animate, feeling]);

  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.feelingContainer}>
      <Animated.View
        style={[
          styles.emojiContainer,
          {
            transform: [
              { scale: scaleValue },
              { rotate: rotation },
            ],
          },
        ]}
      >
        <Text style={[styles.emoji, { fontSize: size }]}>
          {feeling.animatedEmoji[currentEmojiIndex]}
        </Text>
      </Animated.View>
      <View
        style={[
          styles.glowEffect,
          { 
            backgroundColor: feeling.color + '30',
            width: size * 1.5,
            height: size * 1.5,
          }
        ]}
      />
    </View>
  );
};

// Activity component
interface ActivityItemProps {
  activity: typeof ACTIVITIES_DATA[0];
  size?: number;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ 
  activity, 
  size = 40 
}) => (
  <View style={styles.activityContainer}>
    <View
      style={[
        styles.activityIconContainer,
        { 
          backgroundColor: activity.color + '20',
          width: size,
          height: size,
          borderRadius: size / 2,
        }
      ]}
    >
      <Text style={[styles.activityEmoji, { fontSize: size * 0.6 }]}>
        {activity.emoji}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  feelingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emojiContainer: {
    zIndex: 2,
  },
  emoji: {
    textAlign: 'center',
  },
  glowEffect: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.3,
    zIndex: 1,
  },
  activityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityEmoji: {
    textAlign: 'center',
  },
});

export default {
  FEELINGS_DATA,
  ACTIVITIES_DATA,
  AnimatedFeeling,
  ActivityItem,
};