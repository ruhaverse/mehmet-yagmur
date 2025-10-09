// Social Login Icons - Modern SVG-based social media icons
// Replaces missing PNG assets for Google, Facebook, LinkedIn

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Since we don't have react-native-svg, we'll use Unicode characters and styling
// These will provide modern-looking social login buttons

interface SocialIconProps {
  onPress?: () => void;
  size?: number;
  style?: any;
}

// Google Icon Component
export const GoogleIcon: React.FC<SocialIconProps> = ({ onPress, size = 40, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.iconContainer, { width: size, height: size }, style]}>
    <View style={[styles.googleIcon, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.5 }]}>G</Text>
    </View>
  </TouchableOpacity>
);

// Facebook Icon Component
export const FacebookIcon: React.FC<SocialIconProps> = ({ onPress, size = 40, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.iconContainer, { width: size, height: size }, style]}>
    <View style={[styles.facebookIcon, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.6, color: '#FFFFFF' }]}>f</Text>
    </View>
  </TouchableOpacity>
);

// LinkedIn Icon Component  
export const LinkedInIcon: React.FC<SocialIconProps> = ({ onPress, size = 40, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.iconContainer, { width: size, height: size }, style]}>
    <View style={[styles.linkedinIcon, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.5, color: '#FFFFFF' }]}>in</Text>
    </View>
  </TouchableOpacity>
);

// Alternative Registration Container
interface AlternativeRegistrationProps {
  onGooglePress?: () => void;
  onFacebookPress?: () => void;
  onLinkedInPress?: () => void;
  iconSize?: number;
}

export const AlternativeRegistrationContainer: React.FC<AlternativeRegistrationProps> = ({
  onGooglePress,
  onFacebookPress,
  onLinkedInPress,
  iconSize = 50,
}) => (
  <View style={styles.container}>
    <GoogleIcon onPress={onGooglePress} size={iconSize} style={styles.socialIcon} />
    <FacebookIcon onPress={onFacebookPress} size={iconSize} style={styles.socialIcon} />
    <LinkedInIcon onPress={onLinkedInPress} size={iconSize} style={styles.socialIcon} />
  </View>
);

// Feature Icons using Unicode symbols
export const FeatureIcons = {
  ShareFeed: ({ size = 24, color = '#4CAF50' }) => (
    <View style={[styles.featureIcon, { width: size, height: size, backgroundColor: color + '20' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.6, color }]}>📢</Text>
    </View>
  ),
  
  SwapPoint: ({ size = 24, color = '#FF9800' }) => (
    <View style={[styles.featureIcon, { width: size, height: size, backgroundColor: color + '20' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.6, color }]}>🔄</Text>
    </View>
  ),

  ShareTime: ({ size = 24, color = '#2196F3' }) => (
    <View style={[styles.featureIcon, { width: size, height: size, backgroundColor: color + '20' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.6, color }]}>⏰</Text>
    </View>
  ),

  AddFriends: ({ size = 24, color = '#E91E63' }) => (
    <View style={[styles.featureIcon, { width: size, height: size, backgroundColor: color + '20' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.6, color }]}>👥</Text>
    </View>
  ),

  Reels: ({ size = 24, color = '#9C27B0' }) => (
    <View style={[styles.featureIcon, { width: size, height: size, backgroundColor: color + '20' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.6, color }]}>🎬</Text>
    </View>
  ),

  SavedSwap: ({ size = 24, color = '#607D8B' }) => (
    <View style={[styles.featureIcon, { width: size, height: size, backgroundColor: color + '20' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.6, color }]}>💾</Text>
    </View>
  ),

  Help: ({ size = 24, color = '#795548' }) => (
    <View style={[styles.featureIcon, { width: size, height: size, backgroundColor: color + '20' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.6, color }]}>❓</Text>
    </View>
  ),

  Tag: ({ size = 24, color = '#FF5722' }) => (
    <View style={[styles.featureIcon, { width: size, height: size, backgroundColor: color + '20' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.6, color }]}>🏷️</Text>
    </View>
  ),

  Gift: ({ size = 24, color = '#F44336' }) => (
    <View style={[styles.featureIcon, { width: size, height: size, backgroundColor: color + '20' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.6, color }]}>🎁</Text>
    </View>
  ),

  Food: ({ size = 24, color = '#4CAF50' }) => (
    <View style={[styles.featureIcon, { width: size, height: size, backgroundColor: color + '20' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.6, color }]}>🍕</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    marginHorizontal: 15,
  },
  googleIcon: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  facebookIcon: {
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  linkedinIcon: {
    backgroundColor: '#0A66C2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  iconText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default {
  GoogleIcon,
  FacebookIcon,
  LinkedInIcon,
  AlternativeRegistrationContainer,
  FeatureIcons,
};