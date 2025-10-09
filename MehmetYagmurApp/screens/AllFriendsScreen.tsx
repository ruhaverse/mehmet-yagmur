import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Friend {
  id: string;
  name: string;
  username: string;
  profilePicture: string;
  isOnline: boolean;
  mutualFriends: number;
  lastSeen?: string;
}

export default function AllFriendsScreen({ navigation }: any) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'online' | 'recent'>('all');

  useEffect(() => {
    loadFriends();
  }, []);

  useEffect(() => {
    filterFriends();
  }, [friends, searchQuery, filter]);

  const loadFriends = () => {
    // Simulate loading friends data
    const mockFriends: Friend[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        username: 'alice_j',
        profilePicture: 'https://picsum.photos/50/50?random=1',
        isOnline: true,
        mutualFriends: 15,
      },
      {
        id: '2',
        name: 'Bob Smith',
        username: 'bob_smith',
        profilePicture: 'https://picsum.photos/50/50?random=2',
        isOnline: false,
        mutualFriends: 8,
        lastSeen: '2 hours ago',
      },
      {
        id: '3',
        name: 'Carol Davis',
        username: 'carol_d',
        profilePicture: 'https://picsum.photos/50/50?random=3',
        isOnline: true,
        mutualFriends: 23,
      },
      {
        id: '4',
        name: 'David Wilson',
        username: 'david_w',
        profilePicture: 'https://picsum.photos/50/50?random=4',
        isOnline: false,
        mutualFriends: 5,
        lastSeen: '1 day ago',
      },
      {
        id: '5',
        name: 'Eva Brown',
        username: 'eva_brown',
        profilePicture: 'https://picsum.photos/50/50?random=5',
        isOnline: true,
        mutualFriends: 12,
      },
      {
        id: '6',
        name: 'Frank Miller',
        username: 'frank_m',
        profilePicture: 'https://picsum.photos/50/50?random=6',
        isOnline: false,
        mutualFriends: 7,
        lastSeen: '3 days ago',
      },
    ];
    
    setFriends(mockFriends);
  };

  const filterFriends = () => {
    let filtered = friends;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    switch (filter) {
      case 'online':
        filtered = filtered.filter(friend => friend.isOnline);
        break;
      case 'recent':
        filtered = filtered.filter(friend => 
          friend.isOnline || (friend.lastSeen && friend.lastSeen.includes('hour'))
        );
        break;
    }

    setFilteredFriends(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadFriends();
      setRefreshing(false);
    }, 1000);
  };

  const handleRemoveFriend = (friendId: string, friendName: string) => {
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${friendName} from your friends?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setFriends(prev => prev.filter(friend => friend.id !== friendId));
          }
        },
      ]
    );
  };

  const handleMessageFriend = (friend: Friend) => {
    navigation.navigate('Chat', { 
      chatId: `chat_${friend.id}`,
      chatName: friend.name 
    });
  };

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => navigation.navigate('Profile', { userId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.friendInfo}>
        <View style={styles.profilePictureContainer}>
          <Image 
            source={{ uri: item.profilePicture }} 
            style={styles.profilePicture}
          />
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.friendDetails}>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text style={styles.username}>@{item.username}</Text>
          <View style={styles.statusContainer}>
            {item.isOnline ? (
              <Text style={styles.onlineText}>Online</Text>
            ) : (
              <Text style={styles.lastSeenText}>Last seen {item.lastSeen}</Text>
            )}
            <Text style={styles.mutualFriends}>
              {item.mutualFriends} mutual friends
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => handleMessageFriend(item)}
        >
          <Icon name="message" size={16} color="#2196f3" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => handleRemoveFriend(item.id, item.name)}
        >
          <Icon name="more-vert" size={16} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getFilterCount = (filterType: typeof filter) => {
    switch (filterType) {
      case 'online':
        return friends.filter(f => f.isOnline).length;
      case 'recent':
        return friends.filter(f => 
          f.isOnline || (f.lastSeen && f.lastSeen.includes('hour'))
        ).length;
      default:
        return friends.length;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friends</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('AddNewFriend')}
        >
          <Icon name="person-add" size={24} color="#2196f3" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterTabText,
            filter === 'all' && styles.activeFilterTabText
          ]}>
            All ({getFilterCount('all')})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filter === 'online' && styles.activeFilterTab]}
          onPress={() => setFilter('online')}
        >
          <Text style={[
            styles.filterTabText,
            filter === 'online' && styles.activeFilterTabText
          ]}>
            Online ({getFilterCount('online')})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filter === 'recent' && styles.activeFilterTab]}
          onPress={() => setFilter('recent')}
        >
          <Text style={[
            styles.filterTabText,
            filter === 'recent' && styles.activeFilterTabText
          ]}>
            Recent ({getFilterCount('recent')})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Friends List */}
      <FlatList
        data={filteredFriends}
        renderItem={renderFriendItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="people" size={64} color="#ddd" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No friends found' : 'No friends yet'}
            </Text>
            <Text style={styles.emptySubText}>
              {searchQuery 
                ? 'Try a different search term'
                : 'Add friends to see them here'
              }
            </Text>
            {!searchQuery && (
              <TouchableOpacity 
                style={styles.addFriendsButton}
                onPress={() => navigation.navigate('AddNewFriend')}
              >
                <Text style={styles.addFriendsButtonText}>Add Friends</Text>
              </TouchableOpacity>
            )}
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterTab: {
    borderBottomColor: '#2196f3',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#2196f3',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 16,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePictureContainer: {
    position: 'relative',
    marginRight: 12,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4caf50',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineText: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '500',
  },
  lastSeenText: {
    fontSize: 12,
    color: '#999',
  },
  mutualFriends: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageButton: {
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    marginRight: 8,
  },
  moreButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  addFriendsButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
  },
  addFriendsButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});