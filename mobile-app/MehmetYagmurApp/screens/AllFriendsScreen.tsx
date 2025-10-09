import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AllFriendsScreenProps {
  navigation: any;
}

export default function AllFriendsScreen({ navigation }: AllFriendsScreenProps) {
  const friends = [
    { id: 1, name: 'John Doe', mutualFriends: 12 },
    { id: 2, name: 'Jane Smith', mutualFriends: 8 },
    { id: 3, name: 'Mike Johnson', mutualFriends: 15 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Friends</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddNewFriend')}>
          <Text style={styles.addButton}>Add Friends</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.friendsList}>
        {friends.map(friend => (
          <TouchableOpacity key={friend.id} style={styles.friendItem}>
            <View style={styles.avatar} />
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.mutualFriends}>{friend.mutualFriends} mutual friends</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '600',
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
  mutualFriends: {
    fontSize: 14,
    color: '#666',
  },
});