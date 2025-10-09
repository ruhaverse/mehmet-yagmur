// Centralized Asset Index - Main export for all visual assets
// This replaces individual asset imports throughout the app

// Asset Components
export { default as AssetManager, TabIcons, AppLogo } from './AssetManager';
export { 
  FEELINGS_DATA, 
  ACTIVITIES_DATA, 
  AnimatedFeeling
} from './FeelingSystem';
export {
  GoogleIcon,
  FacebookIcon,
  LinkedInIcon,
  AlternativeRegistrationContainer,
  FeatureIcons,
} from './SocialIcons';

// Asset Types for TypeScript
export interface AssetIconProps {
  size?: number;
  color?: string;
  style?: any;
  onPress?: () => void;
}

export interface FeelingData {
  id: number;
  name: string;
  animatedEmojis: string[];
  color: string;
  bgColor: string;
}

export interface ActivityData {
  id: number;
  name: string;
  emoji: string;
  color: string;
}

// Asset Configuration
export const ASSET_CONFIG = {
  // Icon sizes
  ICON_SIZES: {
    SMALL: 16,
    MEDIUM: 24,
    LARGE: 32,
    XLARGE: 48,
    TAB: 28,
  },
  
  // Colors
  COLORS: {
    PRIMARY: '#007AFF',
    SECONDARY: '#34C759',
    ACCENT: '#FF3B30',
    SUCCESS: '#4CAF50',
    WARNING: '#FF9800',
    ERROR: '#F44336',
    INFO: '#2196F3',
    LIGHT_GRAY: '#F5F5F5',
    GRAY: '#9E9E9E',
    DARK_GRAY: '#424242',
  },
  
  // Animation timings
  ANIMATIONS: {
    FAST: 150,
    MEDIUM: 300,
    SLOW: 500,
    SPRING_CONFIG: {
      tension: 100,
      friction: 8,
    },
  },
  
  // Asset paths (for future file-based assets)
  PATHS: {
    ICONS: '/assets/icons/',
    IMAGES: '/assets/images/',
    FEELINGS: '/assets/feelings/',
    TAB_NAVIGATION: '/assets/tab-navigation-icons/',
  },
};

// Asset Preloader (for future optimization)
export const preloadAssets = async () => {
  // This function will be expanded when we add image assets
  console.log('Assets preloaded successfully');
  return Promise.resolve();
};