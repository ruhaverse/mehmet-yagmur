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
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Group {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'technology' | 'sports' | 'music' | 'art' | 'education' | 'gaming' | 'business' | 'lifestyle';
  privacy: 'public' | 'private' | 'secret';
  membersCount: number;
  postsCount: number;
  createdAt: string;
  adminInfo: {
    id: string;
    name: string;
    image: string;
  };
  isJoined: boolean;
  isPending: boolean;
  isRecommended: boolean;
  isTrending: boolean;
  tags: string[];
  rules: string[];
  recentActivity: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export default function GroupListScreen({ navigation }: any) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'joined' | 'recommended' | 'trending'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    category: 'technology',
    privacy: 'public' as 'public' | 'private',
  });

  // Mock data
  useEffect(() => {
    setCategories([
      { id: 'all', name: 'All', icon: '🌍', count: 150 },
      { id: 'technology', name: 'Technology', icon: '💻', count: 42 },
      { id: 'sports', name: 'Sports', icon: '⚽', count: 38 },
      { id: 'music', name: 'Music', icon: '🎵', count: 25 },
      { id: 'art', name: 'Art', icon: '🎨', count: 20 },
      { id: 'education', name: 'Education', icon: '📚', count: 15 },
      { id: 'gaming', name: 'Gaming', icon: '🎮', count: 30 },
      { id: 'business', name: 'Business', icon: '💼', count: 18 },
      { id: 'lifestyle', name: 'Lifestyle', icon: '✨', count: 22 },
    ]);

    setGroups([
      {
        id: 'group1',
        name: 'React Native Developers',
        description: 'A community for React Native developers to share knowledge, discuss best practices, and help each other build amazing mobile applications.',
        image: 'https://picsum.photos/120/120?random=101',
        category: 'technology',
        privacy: 'public',
        membersCount: 15420,
        postsCount: 2840,
        createdAt: '2023-06-15',
        adminInfo: {
          id: 'admin1',
          name: 'John Developer',
          image: 'https://picsum.photos/40/40?random=201',
        },
        isJoined: true,
        isPending: false,
        isRecommended: true,
        isTrending: true,
        tags: ['react-native', 'mobile', 'javascript', 'typescript'],
        rules: [
          'Be respectful to all members',
          'No spam or self-promotion without permission',
          'Stay on topic - React Native related content only',
          'Use search before asking questions',
        ],
        recentActivity: '5 minutes ago',
      },
      {
        id: 'group2',
        name: 'Football Fans United',
        description: 'The ultimate destination for football enthusiasts. Discuss matches, share highlights, and connect with fans from around the world.',
        image: 'https://picsum.photos/120/120?random=102',
        category: 'sports',
        privacy: 'public',
        membersCount: 28750,
        postsCount: 8920,
        createdAt: '2023-03-20',
        adminInfo: {
          id: 'admin2',
          name: 'Sarah Sports',
          image: 'https://picsum.photos/40/40?random=202',
        },
        isJoined: false,
        isPending: false,
        isRecommended: true,
        isTrending: true,
        tags: ['football', 'soccer', 'sports', 'matches'],
        rules: [
          'No offensive language or hate speech',
          'Respect all teams and players',
          'No illegal streaming links',
          'Keep discussions civil and friendly',
        ],
        recentActivity: '12 minutes ago',
      },
      {
        id: 'group3',
        name: 'Digital Artists Hub',
        description: 'A creative space for digital artists to showcase their work, get feedback, and learn new techniques from fellow artists.',
        image: 'https://picsum.photos/120/120?random=103',
        category: 'art',
        privacy: 'public',
        membersCount: 9240,
        postsCount: 5670,
        createdAt: '2023-08-10',
        adminInfo: {
          id: 'admin3',
          name: 'Mike Artist',
          image: 'https://picsum.photos/40/40?random=203',
        },
        isJoined: false,
        isPending: true,
        isRecommended: false,
        isTrending: false,
        tags: ['digital-art', 'design', 'photoshop', 'illustration'],
        rules: [
          'Only share original artwork',
          'Provide constructive feedback',
          'Credit other artists when sharing',
          'No NSFW content without warning',
        ],
        recentActivity: '1 hour ago',
      },
      {
        id: 'group4',
        name: 'Indie Music Lovers',
        description: 'Discover new indie artists, share your favorite tracks, and discuss the latest in independent music scene.',
        image: 'https://picsum.photos/120/120?random=104',
        category: 'music',
        privacy: 'private',
        membersCount: 5680,
        postsCount: 3420,
        createdAt: '2023-09-05',
        adminInfo: {
          id: 'admin4',
          name: 'Emma Music',
          image: 'https://picsum.photos/40/40?random=204',
        },
        isJoined: true,
        isPending: false,
        isRecommended: false,
        isTrending: false,
        tags: ['indie', 'music', 'alternative', 'underground'],
        rules: [
          'Support indie artists',
          'Share music with proper credits',
          'No mainstream music posts',
          'Be open to new genres',
        ],
        recentActivity: '3 hours ago',
      },
      {
        id: 'group5',
        name: 'Startup Entrepreneurs',
        description: 'Connect with fellow entrepreneurs, share startup experiences, and find co-founders or mentors for your next venture.',
        image: 'https://picsum.photos/120/120?random=105',
        category: 'business',
        privacy: 'private',
        membersCount: 12340,
        postsCount: 4560,
        createdAt: '2023-07-22',
        adminInfo: {
          id: 'admin5',
          name: 'David Business',
          image: 'https://picsum.photos/40/40?random=205',
        },
        isJoined: false,
        isPending: false,
        isRecommended: true,
        isTrending: false,
        tags: ['startup', 'entrepreneurship', 'business', 'networking'],
        rules: [
          'No direct sales or spam',
          'Share valuable insights and experiences',
          'Respect confidentiality',
          'Help others succeed',
        ],
        recentActivity: '45 minutes ago',
      },
      {
        id: 'group6',
        name: 'Mobile Gaming Pro',
        description: 'The best community for mobile gamers. Share tips, strategies, and connect with players from your favorite mobile games.',
        image: 'https://picsum.photos/120/120?random=106',
        category: 'gaming',
        privacy: 'public',
        membersCount: 18920,
        postsCount: 7890,
        createdAt: '2023-04-18',
        adminInfo: {
          id: 'admin6',
          name: 'Alex Gamer',
          image: 'https://picsum.photos/40/40?random=206',
        },
        isJoined: true,
        isPending: false,
        isRecommended: false,
        isTrending: true,
        tags: ['mobile-gaming', 'strategy', 'multiplayer', 'tournaments'],
        rules: [
          'No cheating or hacking discussions',
          'Be respectful to all skill levels',
          'Share helpful tips and guides',
          'No account selling',
        ],
        recentActivity: '8 minutes ago',
      },
    ]);
  }, []);

  const filteredGroups = groups.filter(group => {
    const matchesSearch = !searchQuery || 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;

    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'joined' && group.isJoined) ||
      (filterType === 'recommended' && group.isRecommended) ||
      (filterType === 'trending' && group.isTrending);

    return matchesSearch && matchesCategory && matchesFilter;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleJoinGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    if (group.privacy === 'private') {
      // Send join request
      setGroups(prev => prev.map(g => 
        g.id === groupId ? { ...g, isPending: true } : g
      ));
      Alert.alert('Request Sent', 'Your request to join this private group has been sent to the admins.');
    } else {
      // Join directly
      setGroups(prev => prev.map(g => 
        g.id === groupId ? { ...g, isJoined: true, membersCount: g.membersCount + 1 } : g
      ));
      Alert.alert('Joined!', `You have successfully joined ${group.name}`);
    }
  };

  const handleLeaveGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    Alert.alert(
      'Leave Group',
      `Are you sure you want to leave ${group.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            setGroups(prev => prev.map(g => 
              g.id === groupId ? { 
                ...g, 
                isJoined: false, 
                isPending: false,
                membersCount: Math.max(0, g.membersCount - 1)
              } : g
            ));
          }
        }
      ]
    );
  };

  const handleCreateGroup = () => {
    if (!createForm.name.trim() || !createForm.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newGroup: Group = {
      id: `group_${Date.now()}`,
      name: createForm.name.trim(),
      description: createForm.description.trim(),
      image: `https://picsum.photos/120/120?random=${Date.now()}`,
      category: createForm.category as any,
      privacy: createForm.privacy,
      membersCount: 1,
      postsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      adminInfo: {
        id: 'me',
        name: 'You',
        image: 'https://picsum.photos/40/40?random=me',
      },
      isJoined: true,
      isPending: false,
      isRecommended: false,
      isTrending: false,
      tags: [],
      rules: [
        'Be respectful to all members',
        'Stay on topic',
        'No spam or inappropriate content',
      ],
      recentActivity: 'just now',
    };

    setGroups(prev => [newGroup, ...prev]);
    setCreateForm({
      name: '',
      description: '',
      category: 'technology',
      privacy: 'public',
    });
    setShowCreateModal(false);
    
    Alert.alert('Success!', 'Your group has been created successfully', [
      {
        text: 'View Group',
        onPress: () => navigation.navigate('GroupScreen', { groupId: newGroup.id })
      }
    ]);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const renderGroupCard = (group: Group) => (
    <TouchableOpacity
      key={group.id}
      style={styles.groupCard}
      onPress={() => navigation.navigate('GroupScreen', { groupId: group.id })}
    >
      {/* Group Header */}
      <View style={styles.groupHeader}>
        <Image source={{ uri: group.image }} style={styles.groupImage} />
        
        <View style={styles.groupInfo}>
          <View style={styles.groupTitleRow}>
            <Text style={styles.groupName} numberOfLines={1}>
              {group.name}
            </Text>
            <View style={styles.groupBadges}>
              {group.privacy === 'private' && (
                <View style={styles.privateBadge}>
                  <Text style={styles.badgeText}>🔒</Text>
                </View>
              )}
              {group.isTrending && (
                <View style={styles.trendingBadge}>
                  <Text style={styles.badgeText}>🔥</Text>
                </View>
              )}
              {group.isRecommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.badgeText}>⭐</Text>
                </View>
              )}
            </View>
          </View>
          
          <Text style={styles.groupDescription} numberOfLines={2}>
            {group.description}
          </Text>
          
          <View style={styles.groupStats}>
            <Text style={styles.groupStat}>
              👥 {formatNumber(group.membersCount)} members
            </Text>
            <Text style={styles.groupStat}>•</Text>
            <Text style={styles.groupStat}>
              📝 {formatNumber(group.postsCount)} posts
            </Text>
          </View>

          <View style={styles.groupMeta}>
            <View style={styles.adminInfo}>
              <Image source={{ uri: group.adminInfo.image }} style={styles.adminImage} />
              <Text style={styles.adminText}>Admin: {group.adminInfo.name}</Text>
            </View>
            <Text style={styles.recentActivity}>
              Active {group.recentActivity}
            </Text>
          </View>
        </View>
      </View>

      {/* Tags */}
      {group.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {group.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          {group.tags.length > 3 && (
            <Text style={styles.moreTags}>+{group.tags.length - 3} more</Text>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.groupActions}>
        {group.isJoined ? (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, styles.viewButton]}
              onPress={() => navigation.navigate('GroupScreen', { groupId: group.id })}
            >
              <Text style={styles.viewButtonText}>View Group</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.leaveButton]}
              onPress={() => handleLeaveGroup(group.id)}
            >
              <Text style={styles.leaveButtonText}>Leave</Text>
            </TouchableOpacity>
          </>
        ) : group.isPending ? (
          <TouchableOpacity 
            style={[styles.actionButton, styles.pendingButton]}
            disabled
          >
            <Text style={styles.pendingButtonText}>Request Pending</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, styles.joinButton]}
            onPress={() => handleJoinGroup(group.id)}
          >
            <Text style={styles.joinButtonText}>
              {group.privacy === 'private' ? 'Request to Join' : 'Join Group'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategoryTab = (category: Category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryTab,
        selectedCategory === category.id && styles.activeCategoryTab
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={[
        styles.categoryText,
        selectedCategory === category.id && styles.activeCategoryText
      ]}>
        {category.name}
      </Text>
      <View style={styles.categoryCount}>
        <Text style={styles.categoryCountText}>{category.count}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Groups</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createIcon}>➕</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups, topics, or tags..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
          {[
            { key: 'all', label: 'All Groups', count: groups.length },
            { key: 'joined', label: 'My Groups', count: groups.filter(g => g.isJoined).length },
            { key: 'recommended', label: 'Recommended', count: groups.filter(g => g.isRecommended).length },
            { key: 'trending', label: 'Trending', count: groups.filter(g => g.isTrending).length },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                filterType === filter.key && styles.activeFilterTab
              ]}
              onPress={() => setFilterType(filter.key as any)}
            >
              <Text style={[
                styles.filterText,
                filterType === filter.key && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
              <View style={styles.filterCount}>
                <Text style={styles.filterCountText}>{filter.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {categories.map(renderCategoryTab)}
        </ScrollView>
      </View>

      {/* Groups List */}
      <ScrollView
        style={styles.groupsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredGroups.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No groups found</Text>
            <Text style={styles.emptyMessage}>
              {searchQuery 
                ? "Try searching with different keywords or check a different category"
                : "Be the first to create a group in this category!"
              }
            </Text>
            <TouchableOpacity 
              style={styles.createGroupButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.createGroupText}>Create New Group</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredGroups.map(renderGroupCard)
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Create Group Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Group</Text>
            <TouchableOpacity onPress={handleCreateGroup}>
              <Text style={styles.modalCreate}>Create</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Group Name *</Text>
              <TextInput
                style={styles.input}
                value={createForm.name}
                onChangeText={(text) => setCreateForm(prev => ({ ...prev, name: text }))}
                placeholder="Enter group name"
                maxLength={50}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={createForm.description}
                onChangeText={(text) => setCreateForm(prev => ({ ...prev, description: text }))}
                placeholder="Describe what your group is about"
                multiline
                numberOfLines={4}
                maxLength={300}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryOptions}>
                  {categories.slice(1).map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        createForm.category === category.id && styles.activeCategoryOption
                      ]}
                      onPress={() => setCreateForm(prev => ({ ...prev, category: category.id }))}
                    >
                      <Text style={styles.categoryOptionIcon}>{category.icon}</Text>
                      <Text style={[
                        styles.categoryOptionText,
                        createForm.category === category.id && styles.activeCategoryOptionText
                      ]}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Privacy</Text>
              <View style={styles.privacyOptions}>
                <TouchableOpacity
                  style={[
                    styles.privacyOption,
                    createForm.privacy === 'public' && styles.activePrivacyOption
                  ]}
                  onPress={() => setCreateForm(prev => ({ ...prev, privacy: 'public' }))}
                >
                  <Text style={styles.privacyIcon}>🌍</Text>
                  <View style={styles.privacyInfo}>
                    <Text style={styles.privacyTitle}>Public</Text>
                    <Text style={styles.privacyDescription}>
                      Anyone can find and join this group
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.privacyOption,
                    createForm.privacy === 'private' && styles.activePrivacyOption
                  ]}
                  onPress={() => setCreateForm(prev => ({ ...prev, privacy: 'private' }))}
                >
                  <Text style={styles.privacyIcon}>🔒</Text>
                  <View style={styles.privacyInfo}>
                    <Text style={styles.privacyTitle}>Private</Text>
                    <Text style={styles.privacyDescription}>
                      People need approval to join
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  createButton: {
    padding: 8,
  },
  createIcon: {
    fontSize: 24,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  filterContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterTabs: {
    paddingHorizontal: 16,
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
    backgroundColor: '#2196f3',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  filterCount: {
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  categoriesContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categories: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    minWidth: 80,
  },
  activeCategoryTab: {
    backgroundColor: '#e3f2fd',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  activeCategoryText: {
    color: '#2196f3',
    fontWeight: '600',
  },
  categoryCount: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
  categoryCountText: {
    fontSize: 10,
    color: '#666',
  },
  groupsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  groupCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  groupImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  groupBadges: {
    flexDirection: 'row',
  },
  privateBadge: {
    backgroundColor: '#ff9800',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  trendingBadge: {
    backgroundColor: '#f44336',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  recommendedBadge: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  badgeText: {
    fontSize: 10,
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  groupStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupStat: {
    fontSize: 12,
    color: '#888',
    marginRight: 8,
  },
  groupMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  adminText: {
    fontSize: 11,
    color: '#888',
  },
  recentActivity: {
    fontSize: 11,
    color: '#4caf50',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#2196f3',
    fontWeight: '500',
  },
  moreTags: {
    fontSize: 11,
    color: '#666',
  },
  groupActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  joinButton: {
    backgroundColor: '#2196f3',
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: '#4caf50',
    marginRight: 8,
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  leaveButton: {
    backgroundColor: '#f5f5f5',
  },
  leaveButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  pendingButton: {
    backgroundColor: '#ff9800',
  },
  pendingButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  createGroupButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createGroupText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalCancel: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalCreate: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoryOptions: {
    flexDirection: 'row',
  },
  categoryOption: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    minWidth: 80,
  },
  activeCategoryOption: {
    backgroundColor: '#2196f3',
  },
  categoryOptionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryOptionText: {
    fontSize: 12,
    color: '#666',
  },
  activeCategoryOptionText: {
    color: '#ffffff',
  },
  privacyOptions: {
    gap: 12,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activePrivacyOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  privacyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  privacyInfo: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 14,
    color: '#666',
  },
});