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

interface User {
  id: string;
  name: string;
  username: string;
  profilePicture: string;
  mutualFriends: number;
  isRequested: boolean;
  isPending: boolean;
  isFriend: boolean;
}

interface SuggestedUser extends User {
  reason: 'mutual_friends' | 'contacts' | 'location' | 'interests';
}

export default function AddNewFriendScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'suggestions'>('suggestions');

  useEffect(() => {
    loadSuggestions();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadSuggestions = () => {
    const mockSuggestions: SuggestedUser[] = [
      {
        id: '1',
        name: 'Emma Wilson',
        username: 'emma_w',
        profilePicture: 'https://picsum.photos/50/50?random=11',
        mutualFriends: 5,
        isRequested: false,
        isPending: false,
        isFriend: false,
        reason: 'mutual_friends',
      },
      {
        id: '2',
        name: 'James Brown',
        username: 'james_b',
        profilePicture: 'https://picsum.photos/50/50?random=12',
        mutualFriends: 8,
        isRequested: false,
        isPending: false,
        isFriend: false,
        reason: 'contacts',
      },
      {
        id: '3',
        name: 'Sarah Davis',
        username: 'sarah_d',
        profilePicture: 'https://picsum.photos/50/50?random=13',
        mutualFriends: 3,
        isRequested: true,
        isPending: false,
        isFriend: false,
        reason: 'location',
      },
      {
        id: '4',
        name: 'Mike Johnson',
        username: 'mike_j',
        profilePicture: 'https://picsum.photos/50/50?random=14',
        mutualFriends: 12,
        isRequested: false,
        isPending: true,
        isFriend: false,
        reason: 'interests',
      },
    ];
    
    setSuggestions(mockSuggestions);
  };

  const performSearch = () => {
    // Simulate search API call
    const mockResults: User[] = [
      {
        id: '5',
        name: 'Alex Turner',
        username: 'alex_turner',
        profilePicture: 'https://picsum.photos/50/50?random=15',
        mutualFriends: 2,
        isRequested: false,
        isPending: false,
        isFriend: false,
      },
      {
        id: '6',
        name: 'Lisa Chen',
        username: 'lisa_chen',
        profilePicture: 'https://picsum.photos/50/50?random=16',
        mutualFriends: 0,
        isRequested: false,
        isPending: false,
        isFriend: false,
      },
    ];
    
    setSearchResults(mockResults);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      if (activeTab === 'suggestions') {
        loadSuggestions();
      } else if (searchQuery.trim()) {
        performSearch();
      }
      setRefreshing(false);
    }, 1000);
  };

  const handleSendRequest = (userId: string) => {
    Alert.alert(
      'Friend Request',
      'Friend request sent successfully!',
      [{ text: 'OK' }]
    );

    // Update user status
    const updateUser = (user: User) => 
      user.id === userId ? { ...user, isRequested: true } : user;

    setSearchResults(prev => prev.map(updateUser));
    setSuggestions(prev => prev.map(updateUser));
  };

  const handleCancelRequest = (userId: string) => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this friend request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            // Update user status
            const updateUser = (user: User) => 
              user.id === userId ? { ...user, isRequested: false } : user;

            setSearchResults(prev => prev.map(updateUser));
            setSuggestions(prev => prev.map(updateUser));
          }
        },
      ]
    );
  };

  const handleAcceptRequest = (userId: string) => {
    Alert.alert(
      'Accept Request',
      'Friend request accepted!',
      [{ text: 'OK' }]
    );

    // Update user status
    const updateUser = (user: User) => 
      user.id === userId ? { ...user, isPending: false, isFriend: true } : user;

    setSuggestions(prev => prev.map(updateUser));
  };

  const getSuggestionReason = (reason: SuggestedUser['reason']) => {
    switch (reason) {
      case 'mutual_friends':
        return 'Mutual friends';
      case 'contacts':
        return 'From contacts';
      case 'location':
        return 'Nearby';
      case 'interests':
        return 'Similar interests';
      default:
        return '';
    }
  };

  const renderUserItem = ({ item }: { item: User | SuggestedUser }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('Profile', { userId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.userInfo}>
        <Image 
          source={{ uri: item.profilePicture }} 
          style={styles.profilePicture}
        />
        
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.username}>@{item.username}</Text>
          <View style={styles.metaInfo}>
            {item.mutualFriends > 0 && (
              <Text style={styles.mutualFriends}>
                {item.mutualFriends} mutual friends
              </Text>
            )}
            {'reason' in item && (
              <Text style={styles.suggestionReason}>
                • {getSuggestionReason(item.reason)}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
        {item.isFriend ? (
          <View style={styles.friendsBadge}>
            <Icon name="check" size={16} color="#4caf50" />
            <Text style={styles.friendsText}>Friends</Text>
          </View>
        ) : item.isPending ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAcceptRequest(item.id)}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => handleCancelRequest(item.id)}
            >
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        ) : item.isRequested ? (
          <TouchableOpacity
            style={styles.requestedButton}
            onPress={() => handleCancelRequest(item.id)}
          >
            <Text style={styles.requestedButtonText}>Requested</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleSendRequest(item.id)}
          >
            <Icon name="person-add" size={16} color="#ffffff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const pendingRequests = suggestions.filter(user => user.isPending);

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
        <Text style={styles.headerTitle}>Add Friends</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('ReceivedRequests')}
        >
          <View style={styles.requestsButton}>
            <Icon name="people" size={20} color="#2196f3" />
            {pendingRequests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingRequests.length}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search people..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setActiveTab(text.trim() ? 'search' : 'suggestions');
            }}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setActiveTab('suggestions');
            }}>
              <Icon name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      {!searchQuery.trim() && (
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'suggestions' && styles.activeTab
            ]}
            onPress={() => setActiveTab('suggestions')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'suggestions' && styles.activeTabText
            ]}>
              Suggestions
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      <FlatList
        data={activeTab === 'search' ? searchResults : suggestions}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          activeTab === 'suggestions' && pendingRequests.length > 0 ? (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Pending Requests ({pendingRequests.length})
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon 
              name={activeTab === 'search' ? 'search' : 'people'} 
              size={64} 
              color="#ddd" 
            />
            <Text style={styles.emptyText}>
              {activeTab === 'search' 
                ? (searchQuery ? 'No users found' : 'Search for people')
                : 'No suggestions'
              }
            </Text>
            <Text style={styles.emptySubText}>
              {activeTab === 'search'
                ? 'Try searching with a different name or username'
                : 'Check back later for new friend suggestions'
              }
            </Text>
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
  requestsButton: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#f44336',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196f3',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2196f3',
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
  },
  listContainer: {
    paddingBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userDetails: {
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
    color: '#666',
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mutualFriends: {
    fontSize: 12,
    color: '#666',
  },
  suggestionReason: {
    fontSize: 12,
    color: '#2196f3',
    marginLeft: 4,
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  requestedButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  requestedButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  declineButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  declineButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  friendsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  friendsText: {
    color: '#4caf50',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
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
});