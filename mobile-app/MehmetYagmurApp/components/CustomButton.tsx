import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}: CustomButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      paddingHorizontal: size === 'small' ? 12 : size === 'large' ? 24 : 16,
      paddingVertical: size === 'small' ? 8 : size === 'large' ? 16 : 12,
      minWidth: size === 'small' ? 80 : size === 'large' ? 120 : 100,
      opacity: disabled || loading ? 0.6 : 1,
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: '#2196f3',
          shadowColor: '#2196f3',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: '#6c757d',
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: '#2196f3',
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: '#f44336',
          shadowColor: '#f44336',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return {
          ...baseTextStyle,
          color: '#ffffff',
        };
      case 'outline':
        return {
          ...baseTextStyle,
          color: '#2196f3',
        };
      case 'ghost':
        return {
          ...baseTextStyle,
          color: '#2196f3',
        };
      default:
        return baseTextStyle;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            color={variant === 'outline' || variant === 'ghost' ? '#2196f3' : '#ffffff'}
            size="small"
          />
          <Text style={[getTextStyle(), textStyle, styles.loadingText]}>
            Loading...
          </Text>
        </View>
      );
    }

    const textElement = (
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    );

    if (!icon) {
      return textElement;
    }

    return (
      <View style={styles.contentContainer}>
        {iconPosition === 'left' && (
          <View style={[styles.iconContainer, styles.iconLeft]}>
            {icon}
          </View>
        )}
        {textElement}
        {iconPosition === 'right' && (
          <View style={[styles.iconContainer, styles.iconRight]}>
            {icon}
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});