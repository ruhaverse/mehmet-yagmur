import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SearchUser {
  id: string;
  username: string;
  displayName: string;
  profileImage: string;
  isVerified: boolean;
  followersCount: number;
  isFollowing: boolean;
  mutualFollowers?: number;
  bio?: string;
}

interface SearchHashtag {
  id: string;
  tag: string;
  postsCount: number;
  isFollowing: boolean;
  trending: boolean;
  category?: string;
}

interface SearchPost {
  id: string;
  type: 'image' | 'video' | 'text';
  imageUrl?: string;
  videoThumbnail?: string;
  likesCount: number;
  commentsCount: number;
  authorName: string;
  authorImage: string;
  isLiked: boolean;
}

interface SearchLocation {
  id: string;
  name: string;
  address: string;
  postsCount: number;
  category: 'restaurant' | 'attraction' | 'hotel' | 'shop' | 'other';
  rating?: number;
  distance?: number;
}

type SearchFilter = 'all' | 'users' | 'hashtags' | 'posts' | 'locations';

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('all');
  const [refreshing, setRefreshing] = useState(false);
  
  // Search Results
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [hashtags, setHashtags] = useState<SearchHashtag[]>([]);
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [locations, setLocations] = useState<SearchLocation[]>([]);
  
  // Recent Searches & Trending
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<SearchHashtag[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SearchUser[]>([]);

  useEffect(() => {
    // Mock data for trending and suggestions
    setTrendingHashtags([
      { id: 'trending1', tag: 'photography', postsCount: 125000, isFollowing: false, trending: true, category: 'creative' },
      { id: 'trending2', tag: 'travel2024', postsCount: 89000, isFollowing: true, trending: true, category: 'lifestyle' },
      { id: 'trending3', tag: 'foodie', postsCount: 156000, isFollowing: false, trending: true, category: 'lifestyle' },
      { id: 'trending4', tag: 'tech', postsCount: 78000, isFollowing: false, trending: true, category: 'technology' },
      { id: 'trending5', tag: 'fitness', postsCount: 92000, isFollowing: true, trending: true, category: 'health' },
    ]);

    setSuggestedUsers([
      {
        id: 'suggested1',
        username: 'travel_explorer',
        displayName: 'Sarah Wilson',
        profileImage: 'https://picsum.photos/100/100?random=101',
        isVerified: true,
        followersCount: 45000,
        isFollowing: false,
        mutualFollowers: 12,
        bio: 'Travel photographer & storyteller 📸✈️',
      },
      {
        id: 'suggested2',
        username: 'chef_marco',
        displayName: 'Marco Rodriguez',
        profileImage: 'https://picsum.photos/100/100?random=102',
        isVerified: false,
        followersCount: 28000,
        isFollowing: false,
        mutualFollowers: 8,
        bio: 'Professional chef sharing culinary adventures 👨‍🍳',
      },
      {
        id: 'suggested3',
        username: 'tech_innovator',
        displayName: 'Alex Chen',
        profileImage: 'https://picsum.photos/100/100?random=103',
        isVerified: true,
        followersCount: 67000,
        isFollowing: false,
        mutualFollowers: 15,
        bio: 'Software engineer & tech enthusiast 💻',
      },
    ]);

    setRecentSearches(['photography', 'travel_explorer', 'san francisco', 'food photography', 'tech']);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      performSearch(searchQuery);
    }
  }, [searchQuery]);

  const performSearch = (query: string) => {
    // Mock search results
    const mockUsers: SearchUser[] = [
      {
        id: 'user1',
        username: 'photo_artist',
        displayName: 'Emily Johnson',
        profileImage: 'https://picsum.photos/100/100?random=201',
        isVerified: false,
        followersCount: 12500,
        isFollowing: false,
        mutualFollowers: 5,
        bio: 'Digital artist & photographer',
      },
      {
        id: 'user2',
        username: 'travel_blogger',
        displayName: 'David Kim',
        profileImage: 'https://picsum.photos/100/100?random=202',
        isVerified: true,
        followersCount: 89000,
        isFollowing: true,
        mutualFollowers: 23,
        bio: 'Exploring the world one photo at a time 🌍',
      },
    ];

    const mockHashtags: SearchHashtag[] = [
      { id: 'hash1', tag: 'photography', postsCount: 125000, isFollowing: false, trending: true },
      { id: 'hash2', tag: 'photooftheday', postsCount: 89000, isFollowing: true, trending: false },
      { id: 'hash3', tag: 'photographer', postsCount: 67000, isFollowing: false, trending: false },
    ];

    const mockPosts: SearchPost[] = [
      {
        id: 'post1',
        type: 'image',
        imageUrl: 'https://picsum.photos/300/300?random=301',
        likesCount: 1250,
        commentsCount: 89,
        authorName: 'photo_artist',
        authorImage: 'https://picsum.photos/50/50?random=201',
        isLiked: false,
      },
      {
        id: 'post2',
        type: 'video',
        videoThumbnail: 'https://picsum.photos/300/300?random=302',
        likesCount: 2340,
        commentsCount: 156,
        authorName: 'travel_blogger',
        authorImage: 'https://picsum.photos/50/50?random=202',
        isLiked: true,
      },
    ];

    const mockLocations: SearchLocation[] = [
      {
        id: 'loc1',
        name: 'Golden Gate Bridge',
        address: 'San Francisco, CA',
        postsCount: 45000,
        category: 'attraction',
        rating: 4.8,
        distance: 2.5,
      },
      {
        id: 'loc2',
        name: 'Photography Studio SF',
        address: 'Downtown San Francisco',
        postsCount: 1200,
        category: 'shop',
        rating: 4.6,
        distance: 5.2,
      },
    ];

    setUsers(mockUsers);
    setHashtags(mockHashtags);
    setPosts(mockPosts);
    setLocations(mockLocations);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 4)]);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleFollowUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ));
    setSuggestedUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ));
  };

  const handleFollowHashtag = (hashtagId: string) => {
    setHashtags(prev => prev.map(hashtag => 
      hashtag.id === hashtagId ? { ...hashtag, isFollowing: !hashtag.isFollowing } : hashtag
    ));
    setTrendingHashtags(prev => prev.map(hashtag => 
      hashtag.id === hashtagId ? { ...hashtag, isFollowing: !hashtag.isFollowing } : hashtag
    ));
  };

  const renderUser = (user: SearchUser) => (
    <TouchableOpacity 
      key={user.id} 
      style={styles.userItem}
      onPress={() => navigation.navigate('ProfileScreen', { userId: user.id })}
    >
      <Image source={{ uri: user.profileImage }} style={styles.userImage} />
      <View style={styles.userInfo}>
        <View style={styles.userNameRow}>
          <Text style={styles.userName}>{user.username}</Text>
          {user.isVerified && <Text style={styles.verifiedIcon}>✓</Text>}
        </View>
        <Text style={styles.userDisplayName}>{user.displayName}</Text>
        {user.bio && <Text style={styles.userBio} numberOfLines={1}>{user.bio}</Text>}
        <View style={styles.userStats}>
          <Text style={styles.followersCount}>
            {user.followersCount.toLocaleString()} followers
          </Text>
          {user.mutualFollowers && user.mutualFollowers > 0 && (
            <Text style={styles.mutualFollowers}>
              • {user.mutualFollowers} mutual
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={[styles.followButton, user.isFollowing && styles.followingButton]}
        onPress={() => handleFollowUser(user.id)}
      >
        <Text style={[styles.followButtonText, user.isFollowing && styles.followingButtonText]}>
          {user.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHashtag = (hashtag: SearchHashtag) => (
    <TouchableOpacity 
      key={hashtag.id} 
      style={styles.hashtagItem}
      onPress={() => navigation.navigate('HashtagScreen', { hashtag: hashtag.tag })}
    >
      <View style={styles.hashtagIcon}>
        <Text style={styles.hashtagSymbol}>#</Text>
      </View>
      <View style={styles.hashtagInfo}>
        <View style={styles.hashtagHeader}>
          <Text style={styles.hashtagName}>#{hashtag.tag}</Text>
          {hashtag.trending && <Text style={styles.trendingIcon}>🔥</Text>}
        </View>
        <Text style={styles.hashtagCount}>
          {hashtag.postsCount.toLocaleString()} posts
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.followHashtagButton, hashtag.isFollowing && styles.followingHashtagButton]}
        onPress={() => handleFollowHashtag(hashtag.id)}
      >
        <Text style={[styles.followHashtagButtonText, hashtag.isFollowing && styles.followingHashtagButtonText]}>
          {hashtag.isFollowing ? '✓' : '+'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPost = (post: SearchPost) => (
    <TouchableOpacity 
      key={post.id} 
      style={styles.postItem}
      onPress={() => navigation.navigate('PostDetailScreen', { postId: post.id })}
    >
      <Image 
        source={{ uri: post.imageUrl || post.videoThumbnail }} 
        style={styles.postImage} 
      />
      {post.type === 'video' && (
        <View style={styles.videoOverlay}>
          <Text style={styles.playIcon}>▶️</Text>
        </View>
      )}
      <View style={styles.postInfo}>
        <View style={styles.postAuthor}>
          <Image source={{ uri: post.authorImage }} style={styles.postAuthorImage} />
          <Text style={styles.postAuthorName}>{post.authorName}</Text>
        </View>
        <View style={styles.postStats}>
          <Text style={styles.postStat}>❤️ {post.likesCount}</Text>
          <Text style={styles.postStat}>💬 {post.commentsCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderLocation = (location: SearchLocation) => (
    <TouchableOpacity 
      key={location.id} 
      style={styles.locationItem}
      onPress={() => navigation.navigate('LocationScreen', { locationId: location.id })}
    >
      <View style={styles.locationIcon}>
        <Text style={styles.locationSymbol}>📍</Text>
      </View>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{location.name}</Text>
        <Text style={styles.locationAddress}>{location.address}</Text>
        <View style={styles.locationMeta}>
          <Text style={styles.locationPosts}>
            {location.postsCount.toLocaleString()} posts
          </Text>
          {location.rating && (
            <Text style={styles.locationRating}>⭐ {location.rating}</Text>
          )}
          {location.distance && (
            <Text style={styles.locationDistance}>{location.distance}km away</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const getFilteredResults = () => {
    switch (activeFilter) {
      case 'users': return users;
      case 'hashtags': return hashtags;
      case 'posts': return posts;
      case 'locations': return locations;
      default: return [...users, ...hashtags, ...posts, ...locations];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users, hashtags, places..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(searchQuery)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      {searchQuery.length > 0 && (
        <View style={styles.filterTabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { key: 'all', label: 'All', count: users.length + hashtags.length + posts.length + locations.length },
              { key: 'users', label: 'People', count: users.length },
              { key: 'hashtags', label: 'Tags', count: hashtags.length },
              { key: 'posts', label: 'Posts', count: posts.length },
              { key: 'locations', label: 'Places', count: locations.length },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterTab,
                  activeFilter === filter.key && styles.activeFilterTab
                ]}
                onPress={() => setActiveFilter(filter.key as SearchFilter)}
              >
                <Text style={[
                  styles.filterTabText,
                  activeFilter === filter.key && styles.activeFilterTabText
                ]}>
                  {filter.label}
                </Text>
                {filter.count > 0 && (
                  <Text style={[
                    styles.filterTabCount,
                    activeFilter === filter.key && styles.activeFilterTabCount
                  ]}>
                    ({filter.count})
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Search Results */}
        {searchQuery.length > 0 ? (
          <View style={styles.searchResults}>
            {activeFilter === 'all' || activeFilter === 'users' ? (
              users.length > 0 && (
                <View style={styles.resultsSection}>
                  {activeFilter === 'all' && <Text style={styles.resultsSectionTitle}>People</Text>}
                  {users.map(renderUser)}
                </View>
              )
            ) : null}

            {activeFilter === 'all' || activeFilter === 'hashtags' ? (
              hashtags.length > 0 && (
                <View style={styles.resultsSection}>
                  {activeFilter === 'all' && <Text style={styles.resultsSectionTitle}>Hashtags</Text>}
                  {hashtags.map(renderHashtag)}
                </View>
              )
            ) : null}

            {activeFilter === 'all' || activeFilter === 'posts' ? (
              posts.length > 0 && (
                <View style={styles.resultsSection}>
                  {activeFilter === 'all' && <Text style={styles.resultsSectionTitle}>Posts</Text>}
                  <View style={styles.postsGrid}>
                    {posts.map(renderPost)}
                  </View>
                </View>
              )
            ) : null}

            {activeFilter === 'all' || activeFilter === 'locations' ? (
              locations.length > 0 && (
                <View style={styles.resultsSection}>
                  {activeFilter === 'all' && <Text style={styles.resultsSectionTitle}>Places</Text>}
                  {locations.map(renderLocation)}
                </View>
              )
            ) : null}

            {getFilteredResults().length === 0 && (
              <View style={styles.noResults}>
                <Text style={styles.noResultsIcon}>🔍</Text>
                <Text style={styles.noResultsTitle}>No results found</Text>
                <Text style={styles.noResultsMessage}>
                  Try searching for something else or check your spelling.
                </Text>
              </View>
            )}
          </View>
        ) : (
          /* Discovery Content */
          <View style={styles.discovery}>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent</Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={styles.clearAllButton}>Clear all</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.recentSearches}>
                  {recentSearches.map((search, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.recentSearchItem}
                      onPress={() => handleSearch(search)}
                    >
                      <Text style={styles.recentSearchIcon}>🕐</Text>
                      <Text style={styles.recentSearchText}>{search}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Trending Hashtags */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trending</Text>
              <View style={styles.trendingGrid}>
                {trendingHashtags.map(renderHashtag)}
              </View>
            </View>

            {/* Suggested Users */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Discover People</Text>
              {suggestedUsers.map(renderUser)}
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearIcon: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  filterTabs: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeFilterTab: {
    backgroundColor: '#e3f2fd',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#2196f3',
  },
  filterTabCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  activeFilterTabCount: {
    color: '#2196f3',
  },
  content: {
    flex: 1,
  },
  searchResults: {
    paddingVertical: 8,
  },
  discovery: {
    paddingVertical: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  clearAllButton: {
    fontSize: 14,
    color: '#2196f3',
  },
  resultsSection: {
    marginBottom: 24,
  },
  resultsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  recentSearches: {
    paddingHorizontal: 16,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  recentSearchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  recentSearchText: {
    fontSize: 16,
    color: '#333',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  verifiedIcon: {
    fontSize: 14,
    color: '#2196f3',
    marginLeft: 4,
  },
  userDisplayName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userBio: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followersCount: {
    fontSize: 13,
    color: '#999',
  },
  mutualFollowers: {
    fontSize: 13,
    color: '#999',
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#2196f3',
  },
  followingButton: {
    backgroundColor: '#f0f0f0',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  followingButtonText: {
    color: '#666',
  },
  hashtagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  hashtagIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  hashtagSymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196f3',
  },
  hashtagInfo: {
    flex: 1,
  },
  hashtagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hashtagName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  trendingIcon: {
    fontSize: 14,
    marginLeft: 6,
  },
  hashtagCount: {
    fontSize: 14,
    color: '#666',
  },
  followHashtagButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followingHashtagButton: {
    backgroundColor: '#4caf50',
  },
  followHashtagButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  followingHashtagButtonText: {
    color: '#ffffff',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  postItem: {
    width: '48%',
    marginRight: '4%',
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
  },
  videoOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  playIcon: {
    fontSize: 16,
  },
  postInfo: {
    padding: 8,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  postAuthorImage: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  postAuthorName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  postStats: {
    flexDirection: 'row',
    gap: 8,
  },
  postStat: {
    fontSize: 11,
    color: '#666',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff3e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationSymbol: {
    fontSize: 18,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationPosts: {
    fontSize: 12,
    color: '#999',
  },
  locationRating: {
    fontSize: 12,
    color: '#ff9800',
  },
  locationDistance: {
    fontSize: 12,
    color: '#999',
  },
  trendingGrid: {
    paddingHorizontal: 16,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 20,
  },
});