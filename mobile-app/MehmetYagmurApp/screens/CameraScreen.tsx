import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CameraScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Camera</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.emptyText}>Camera Feature</Text>
        <Text style={styles.emptySubText}>Take photos and videos to share with friends</Text>
        
        <TouchableOpacity 
          style={styles.cameraButton}
          onPress={() => {/* Camera functionality */}}
        >
          <Text style={styles.cameraButtonText}>Open Camera</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 32,
  },
  cameraButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  cameraButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});