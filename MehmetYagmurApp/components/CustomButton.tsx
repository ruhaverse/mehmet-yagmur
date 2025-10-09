import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator, Text } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  width?: string | number;
  style?: object;
  fontSize?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

const CustomButton: React.FC<CustomButtonProps> = memo(({
  title,
  onPress,
  backgroundColor,
  textColor,
  width = '100%',
  style,
  fontSize,
  icon,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.smallButton);
        break;
      case 'large':
        baseStyle.push(styles.largeButton);
        break;
      default:
        baseStyle.push(styles.mediumButton);
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.secondaryButton);
        break;
      case 'outline':
        baseStyle.push(styles.outlineButton);
        break;
      case 'danger':
        baseStyle.push(styles.dangerButton);
        break;
      default:
        baseStyle.push(styles.primaryButton);
    }

    // Custom styles
    if (backgroundColor) {
      baseStyle.push({ backgroundColor });
    }
    if (width) {
      baseStyle.push({ width });
    }
    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }
    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];
    
    // Size text styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.smallText);
        break;
      case 'large':
        baseStyle.push(styles.largeText);
        break;
      default:
        baseStyle.push(styles.mediumText);
    }

    // Variant text styles
    switch (variant) {
      case 'outline':
        baseStyle.push(styles.outlineText);
        break;
      default:
        baseStyle.push(styles.defaultText);
    }

    if (textColor) {
      baseStyle.push({ color: textColor });
    }
    if (fontSize) {
      baseStyle.push({ fontSize });
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={getButtonStyle()}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={getTextStyle()}>{title}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
});

CustomButton.displayName = 'CustomButton';

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    elevation: 2,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  
  // Size styles
  smallButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 36,
  },
  mediumButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    height: 48,
  },
  largeButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    height: 56,
  },

  // Variant styles
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#6C757D',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  dangerButton: {
    backgroundColor: '#DC3545',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    elevation: 0,
    shadowOpacity: 0,
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },

  // Text styles
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  defaultText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#007AFF',
  },
});

export default CustomButton;