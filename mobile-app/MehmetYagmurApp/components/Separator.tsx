import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface SeparatorProps {
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  lineColor?: string;
  textColor?: string;
  thickness?: number;
  spacing?: number;
  variant?: 'line' | 'text' | 'dashed';
}

const Separator: React.FC<SeparatorProps> = ({
  text,
  style,
  textStyle,
  lineColor = '#E0E0E0',
  textColor = '#666666',
  thickness = 1,
  spacing = 16,
  variant = 'line',
}) => {
  const lineStyle = {
    backgroundColor: lineColor,
    height: thickness,
  };

  const dashStyle = {
    borderTopWidth: thickness,
    borderTopColor: lineColor,
    borderStyle: 'dashed' as const,
  };

  if (variant === 'text' && text) {
    return (
      <View style={[styles.container, { marginVertical: spacing }, style]}>
        <View style={[styles.line, lineStyle]} />
        <Text style={[styles.text, { color: textColor }, textStyle]}>
          {text}
        </Text>
        <View style={[styles.line, lineStyle]} />
      </View>
    );
  }

  if (variant === 'dashed') {
    return (
      <View style={[styles.simpleLine, { marginVertical: spacing }, dashStyle, style]} />
    );
  }

  // Default line separator
  return (
    <View style={[styles.simpleLine, { marginVertical: spacing }, lineStyle, style]} />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
  },
  text: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  simpleLine: {
    width: '100%',
  },
});

export default Separator;