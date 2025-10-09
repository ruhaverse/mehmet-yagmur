import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FriendRequest {
  id: string;
  user: {
    name: string;
    username: string;
    profilePicture: string;
    mutualFriends: number;
  };
  timestamp: string;
}

export default function ReceivedRequestsScreen({ navigation }: any) {
  const [requests, setRequests] = useState<FriendRequest[]>([
    {
      id: '1',
      user: {
        name: 'John Doe',
        username: 'johndoe',
        profilePicture: 'https://picsum.photos/50/50?random=1',
        mutualFriends: 5,
      },
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      user: {
        name: 'Jane Smith',
        username: 'janesmith',
        profilePicture: 'https://picsum.photos/50/50?random=2',
        mutualFriends: 12,
      },
      timestamp: '1 day ago',
    },
  ]);

  const handleAccept = (requestId: string) => {
    Alert.alert('Success', 'Friend request accepted!');
    setRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleDecline = (requestId: string) => {
    Alert.alert('Declined', 'Friend request declined');
    setRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const renderRequest = ({ item }: { item: FriendRequest }) => (
    <View style={styles.requestItem}>
      <Image source={{ uri: item.user.profilePicture }} style={styles.profilePicture} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.user.name}</Text>
        <Text style={styles.username}>@{item.user.username}</Text>
        <Text style={styles.mutualFriends}>{item.user.mutualFriends} mutual friends</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.acceptButton}
          onPress={() => handleAccept(item.id)}
        >
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.declineButton}
          onPress={() => handleDecline(item.id)}
        >
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friend Requests</Text>
        <View />
      </View>
      
      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No friend requests</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backText: {
    fontSize: 16,
    color: '#2196f3',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
  mutualFriends: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  acceptText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  declineButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  declineText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
});