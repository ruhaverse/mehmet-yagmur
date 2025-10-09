import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AccountScreenProps {
  navigation: any;
}

export default function AccountScreen({ navigation }: AccountScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Account Settings</Text>
        
        <TouchableOpacity 
          style={styles.option}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.option}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.option}
          onPress={() => navigation.navigate('Privacy')}
        >
          <Text style={styles.optionText}>Privacy Settings</Text>
        </TouchableOpacity>
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
  },
  option: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});