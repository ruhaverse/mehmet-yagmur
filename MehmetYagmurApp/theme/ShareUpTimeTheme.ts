// ShareUpTime - Brand Colors & Theme
// Time-focused social media app color palette

export const ShareUpTimeColors = {
  // Primary Colors
  primary: '#FF6B6B',        // Coral Red - Main brand color
  primaryLight: '#FF8E8E',   // Light coral for highlights
  primaryDark: '#E85555',    // Dark coral for depth
  
  // Secondary Colors  
  secondary: '#4ECDC4',      // Turquoise - Fresh, modern feel
  secondaryLight: '#7FDDD6', // Light turquoise
  secondaryDark: '#3BBDB4',  // Dark turquoise
  
  // Accent Colors
  accent: '#45B7D1',         // Sky Blue - Time elements
  accentLight: '#6FC7E1',    // Light sky blue
  accentDark: '#3AA7C1',     // Dark sky blue
  
  // Time-specific Colors
  timeActive: '#FFC107',     // Golden yellow - Active time
  timeComplete: '#4CAF50',   // Green - Completed time
  timePending: '#FF9800',    // Orange - Pending time
  timeExpired: '#F44336',    // Red - Expired time
  
  // Neutral Colors
  dark: '#2C3E50',          // Main dark color
  darkSecondary: '#34495E',  // Secondary dark
  light: '#ECF0F1',         // Light background
  white: '#FFFFFF',         // Pure white
  
  // Status Colors
  success: '#27AE60',       // Success green
  warning: '#F39C12',       // Warning orange  
  error: '#E74C3C',         // Error red
  info: '#3498DB',          // Info blue
  
  // Text Colors
  textPrimary: '#2C3E50',   // Main text
  textSecondary: '#7F8C8D', // Secondary text
  textLight: '#BDC3C7',     // Light text
  textWhite: '#FFFFFF',     // White text
  
  // Background Colors
  background: '#F8F9FA',    // Main background
  backgroundDark: '#2C3E50', // Dark mode background
  backgroundCard: '#FFFFFF', // Card background
  backgroundOverlay: 'rgba(44, 62, 80, 0.8)', // Overlay
  
  // Social Colors
  like: '#E91E63',          // Like color (pink)
  comment: '#2196F3',       // Comment color (blue)
  share: '#4CAF50',         // Share color (green)
  follow: '#9C27B0',        // Follow color (purple)
};

export const ShareUpTimeTheme = {
  colors: ShareUpTimeColors,
  
  // Typography
  fonts: {
    regular: 'System',
    medium: 'System-Medium',
    bold: 'System-Bold',
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border Radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
  
  // Shadows
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export default ShareUpTimeTheme;