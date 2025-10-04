import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddPostScreen() {
  return (
    <View style={styles.container}>
      <Text>Add Post Screen</Text>
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