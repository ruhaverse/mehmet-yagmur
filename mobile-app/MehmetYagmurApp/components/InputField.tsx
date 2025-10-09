import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'small' | 'medium' | 'large';
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  showCharacterCount?: boolean;
  maxLength?: number;
}

export default function InputField({
  label,
  error,
  hint,
  required = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'default',
  size = 'medium',
  containerStyle,
  inputStyle,
  labelStyle,
  showCharacterCount = false,
  maxLength,
  value,
  ...textInputProps
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      marginVertical: 8,
    };

    return { ...baseStyle, ...containerStyle };
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: size === 'small' ? 10 : size === 'large' ? 16 : 12,
      borderWidth: 1,
    };

    if (error) {
      baseStyle.borderColor = '#f44336';
    } else if (isFocused) {
      baseStyle.borderColor = '#2196f3';
    } else {
      baseStyle.borderColor = '#e0e0e0';
    }

    switch (variant) {
      case 'default':
        return {
          ...baseStyle,
          backgroundColor: '#ffffff',
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: '#f5f5f5',
          borderColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      color: '#333333',
      paddingVertical: 0,
    };

    if (leftIcon) {
      baseStyle.marginLeft = 12;
    }

    if (rightIcon) {
      baseStyle.marginRight = 12;
    }

    return { ...baseStyle, ...inputStyle };
  };

  const getLabelStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 6,
      color: error ? '#f44336' : '#333333',
    };

    return { ...baseStyle, ...labelStyle };
  };

  const renderLabel = () => {
    if (!label) return null;

    return (
      <View style={styles.labelContainer}>
        <Text style={getLabelStyle()}>
          {label}
          {required && <Text style={styles.requiredIndicator}> *</Text>}
        </Text>
      </View>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <Text style={styles.errorText}>{error}</Text>
    );
  };

  const renderHint = () => {
    if (!hint || error) return null;

    return (
      <Text style={styles.hintText}>{hint}</Text>
    );
  };

  const renderCharacterCount = () => {
    if (!showCharacterCount || !maxLength) return null;

    const currentLength = value?.length || 0;
    const isOverLimit = currentLength > maxLength;

    return (
      <Text style={[
        styles.characterCount,
        isOverLimit && styles.characterCountError
      ]}>
        {currentLength}/{maxLength}
      </Text>
    );
  };

  const renderFooter = () => {
    const hasError = !!error;
    const hasHint = !!hint;
    const hasCharCount = showCharacterCount && maxLength;

    if (!hasError && !hasHint && !hasCharCount) return null;

    return (
      <View style={styles.footerContainer}>
        <View style={styles.footerLeft}>
          {renderError()}
          {renderHint()}
        </View>
        <View style={styles.footerRight}>
          {renderCharacterCount()}
        </View>
      </View>
    );
  };

  return (
    <View style={getContainerStyle()}>
      {renderLabel()}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}

        <TextInput
          {...textInputProps}
          value={value}
          style={getInputStyle()}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          maxLength={maxLength}
          placeholderTextColor="#999999"
        />

        {rightIcon && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {renderFooter()}
    </View>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requiredIndicator: {
    color: '#f44336',
    fontSize: 14,
    fontWeight: '600',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#f44336',
    fontWeight: '500',
  },
  hintText: {
    fontSize: 12,
    color: '#666666',
  },
  characterCount: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  characterCountError: {
    color: '#f44336',
  },
});