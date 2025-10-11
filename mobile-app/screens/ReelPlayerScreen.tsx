import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ReelPlayerScreen() {
  return (
    <View style={styles.container}>
      <Text>Reel Player Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});