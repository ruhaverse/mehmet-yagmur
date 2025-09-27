import React from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';

export default function TestButton() {
  return (
    <View style={styles.container}>
      <Button title="Test Button" onPress={() => Alert.alert('Button Pressed!')} />
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