import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Separator({ style }: { style?: object }) {
  return <View style={[styles.separator, style]} />;
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
});