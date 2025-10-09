// Asset Manager - Modern SVG-based Icon System
// Replaces missing PNG assets with scalable SVG components

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  lightGray: '#C7C7CC',
};

// Home Icon SVG
export const HomeIcon = ({ size = 24, color = colors.black }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 22V12H15V22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Groups Icon SVG
export const GroupsIcon = ({ size = 24, color = colors.black }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
    <Path
      d="M23 21V19C23 18.1645 22.7155 17.3541 22.1911 16.7032C21.6667 16.0523 20.9394 15.5972 20.1213 15.4074"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 3.13C16.8604 3.35031 17.623 3.84071 18.1676 4.52343C18.7122 5.20615 19.0078 6.04656 19.0078 6.915C19.0078 7.78344 18.7122 8.62385 18.1676 9.30657C17.623 9.98929 16.8604 10.4797 16 10.7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Add Icon SVG
export const AddIcon = ({ size = 24, color = colors.white }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={colors.primary} />
    <Path
      d="M12 8V16M8 12H16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Camera/Aperture Icon SVG
export const ApertureIcon = ({ size = 24, color = colors.black }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.31 8L20.05 17.94"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.69 8H21.17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.38 12L13.12 2.06"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.69 16L3.95 6.06"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.31 16H2.83"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.62 12L10.88 21.94"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Share/Message Icon SVG
export const ShareIcon = ({ size = 24, color = colors.black }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="L22 6L12 13L2 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// User/Profile Icon SVG
export const UserIcon = ({ size = 24, color = colors.black }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" />
  </Svg>
);

// Wrapper component for consistent styling
interface IconWrapperProps {
  children: React.ReactNode;
  size?: number;
  style?: any;
  backgroundColor?: string;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ 
  children, 
  size = 40, 
  style,
  backgroundColor = 'transparent' 
}) => (
  <View style={[
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    style
  ]}>
    {children}
  </View>
);

// Export all icons as a collection
export const TabIcons = {
  HomeIcon,
  GroupsIcon,
  AddIcon,
  ApertureIcon,
  ShareIcon,
  UserIcon,
};

// Main Logo Component (Text-based for now)
export const AppLogo = ({ size = 100, color = colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="45" fill={color} />
    <Path
      d="M25 35 L50 20 L75 35 L75 65 L50 80 L25 65 Z"
      fill={colors.white}
    />
    <Circle cx="50" cy="50" r="15" fill={color} />
  </Svg>
);

export default {
  TabIcons,
  IconWrapper,
  AppLogo,
  colors,
};