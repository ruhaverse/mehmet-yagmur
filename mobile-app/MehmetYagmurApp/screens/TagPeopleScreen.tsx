import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TagPeopleScreenProps {
  navigation: any;
}

export default function TagPeopleScreen({ navigation }: TagPeopleScreenProps) {
  const friends = [
    { id: 1, name: 'John Doe', username: '@john_doe' },
    { id: 2, name: 'Jane Smith', username: '@jane_smith' },
    { id: 3, name: 'Mike Johnson', username: '@mike_j' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tag People</Text>
      </View>
      
      <ScrollView style={styles.friendsList}>
        {friends.map(friend => (
          <TouchableOpacity key={friend.id} style={styles.friendItem}>
            <View style={styles.avatar} />
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.username}>{friend.username}</Text>
            </View>
          </TouchableOpacity>
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
  friendsList: {
    flex: 1,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e9ecef',
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: '#2196f3',
  },
});