import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface KeepHangScreenProps {
  navigation: any;
}

export default function KeepHangScreen({ navigation }: KeepHangScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Keep Hanging Out</Text>
        <Text style={styles.subtitle}>Stay connected with your friends</Text>
        
        <View style={styles.options}>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.emoji}>🎮</Text>
            <Text style={styles.optionText}>Play Games</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.emoji}>🎬</Text>
            <Text style={styles.optionText}>Watch Together</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.emoji}>💬</Text>
            <Text style={styles.optionText}>Start Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.emoji}>📞</Text>
            <Text style={styles.optionText}>Voice Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
    textAlign: 'center',
  },
  options: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});