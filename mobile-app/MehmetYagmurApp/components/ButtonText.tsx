import React, { memo } from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';

interface ButtonTextProps {
  children: string;
  style?: TextStyle | TextStyle[];
  color?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  uppercase?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
}

const ButtonText: React.FC<ButtonTextProps> = memo(({
  children,
  style,
  color,
  fontSize,
  fontWeight = '600',
  uppercase = false,
  variant = 'primary',
  size = 'medium',
}) => {
  const getVariantColor = () => {
    switch (variant) {
      case 'primary':
        return color || '#FFFFFF';
      case 'secondary':
        return color || '#6C757D';
      case 'success':
        return color || '#28A745';
      case 'danger':
        return color || '#DC3545';
      case 'warning':
        return color || '#FFC107';
      case 'info':
        return color || '#17A2B8';
      default:
        return color || '#FFFFFF';
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  const textStyle = [
    styles.text,
    getSizeStyle(),
    {
      color: getVariantColor(),
      fontWeight,
      ...(fontSize && { fontSize }),
    },
    style,
  ];

  const displayText = uppercase ? children.toUpperCase() : children;

  return <Text style={textStyle}>{displayText}</Text>;
});

ButtonText.displayName = 'ButtonText';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    includeFontPadding: false,
  },
  smallText: {
    fontSize: 12,
    lineHeight: 16,
  },
  mediumText: {
    fontSize: 16,
    lineHeight: 20,
  },
  largeText: {
    fontSize: 18,
    lineHeight: 24,
  },
});

export default ButtonText;