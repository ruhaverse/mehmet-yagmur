import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppButton from '../components/Button';

export default function TestButton() {
  return (
    <View style={styles.container}>
      <AppButton
        title="Test Button"
        onPress={() => alert('Button Pressed!')}
        color="blue"
        fontSize={20}
        fontColor="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});