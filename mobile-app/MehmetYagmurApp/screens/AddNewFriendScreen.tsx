import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AddNewFriendScreenProps {
  navigation: any;
}

export default function AddNewFriendScreen({ navigation }: AddNewFriendScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const suggestedUsers = [
    { id: 1, name: 'Sarah Wilson', mutualFriends: 5, username: '@sarah_w' },
    { id: 2, name: 'Alex Thompson', mutualFriends: 3, username: '@alex_t' },
    { id: 3, name: 'Emma Davis', mutualFriends: 8, username: '@emma_d' },
  ];

  const sendFriendRequest = (userId: number, name: string) => {
    Alert.alert('Friend Request Sent', `Friend request sent to ${name}!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Friends</Text>
      </View>
      
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for friends..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <Text style={styles.sectionTitle}>Suggested for you</Text>
      
      <ScrollView style={styles.usersList}>
        {suggestedUsers.map(user => (
          <View key={user.id} style={styles.userItem}>
            <View style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.mutualFriends}>{user.mutualFriends} mutual friends</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => sendFriendRequest(user.id, user.name)}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    padding: 16,
    paddingBottom: 8,
  },
  usersList: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e9ecef',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#2196f3',
    marginBottom: 2,
  },
  mutualFriends: {
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});