import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HeaderWithBackArrow({ title, onBackButton }: { title: string; onBackButton: () => void }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackButton} style={styles.backButton}>
        <Text style={styles.backText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 18,
    color: '#007bff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});