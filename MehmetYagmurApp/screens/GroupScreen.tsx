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
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GroupPost {
  id: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  authorRole: 'admin' | 'moderator' | 'member';
  content: string;
  type: 'text' | 'image' | 'poll' | 'event' | 'announcement';
  images?: string[];
  pollOptions?: {
    id: string;
    text: string;
    votes: number;
  }[];
  eventInfo?: {
    title: string;
    date: string;
    location: string;
    attendees: number;
  };
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isPinned: boolean;
}

interface GroupInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  coverImage: string;
  category: string;
  privacy: 'public' | 'private';
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
  isAdmin: boolean;
  isModerator: boolean;
  rules: string[];
  tags: string[];
}

export default function GroupScreen({ route, navigation }: any) {
  const { groupId } = route.params;
  
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'members' | 'events'>('posts');

  // Mock data
  useEffect(() => {
    setGroupInfo({
      id: groupId,
      name: 'React Native Developers',
      description: 'A community for React Native developers to share knowledge, discuss best practices, and help each other build amazing mobile applications.',
      image: 'https://picsum.photos/120/120?random=101',
      coverImage: 'https://picsum.photos/400/200?random=301',
      category: 'Technology',
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
      isAdmin: false,
      isModerator: false,
      rules: [
        'Be respectful to all members',
        'No spam or self-promotion without permission',
        'Stay on topic - React Native related content only',
        'Use search before asking questions',
        'Provide constructive feedback and help others',
        'No offensive language or discrimination',
      ],
      tags: ['react-native', 'mobile', 'javascript', 'typescript'],
    });

    setPosts([
      {
        id: 'post1',
        authorId: 'user1',
        authorName: 'Alice Johnson',
        authorImage: 'https://picsum.photos/50/50?random=11',
        authorRole: 'moderator',
        content: '🚀 Just released a new React Native performance optimization guide! Check out these tips to make your apps blazing fast.',
        type: 'text',
        timestamp: '2 hours ago',
        likes: 124,
        comments: 18,
        shares: 7,
        isLiked: true,
        isPinned: true,
      },
      {
        id: 'post2',
        authorId: 'user2',
        authorName: 'Bob Wilson',
        authorImage: 'https://picsum.photos/50/50?random=12',
        authorRole: 'admin',
        content: '📢 ANNOUNCEMENT: We\'re hosting a virtual React Native workshop next week! Topics will include:\n\n• Navigation best practices\n• State management with Redux Toolkit\n• Performance optimization\n• Testing strategies\n\nWho\'s interested? 🙋‍♂️',
        type: 'announcement',
        timestamp: '4 hours ago',
        likes: 89,
        comments: 25,
        shares: 12,
        isLiked: false,
        isPinned: true,
      },
      {
        id: 'post3',
        authorId: 'user3',
        authorName: 'Carol Davis',
        authorImage: 'https://picsum.photos/50/50?random=13',
        authorRole: 'member',
        content: 'Has anyone worked with React Native\'s new architecture (Fabric + TurboModules)? I\'m looking for some real-world experience and tips.',
        type: 'text',
        timestamp: '6 hours ago',
        likes: 45,
        comments: 12,
        shares: 3,
        isLiked: false,
        isPinned: false,
      },
      {
        id: 'post4',
        authorId: 'user4',
        authorName: 'David Brown',
        authorImage: 'https://picsum.photos/50/50?random=14',
        authorRole: 'member',
        content: 'What\'s your favorite React Native library for handling forms? 🤔',
        type: 'poll',
        pollOptions: [
          { id: 'opt1', text: 'React Hook Form', votes: 45 },
          { id: 'opt2', text: 'Formik', votes: 32 },
          { id: 'opt3', text: 'React Final Form', votes: 18 },
          { id: 'opt4', text: 'Native HTML5 forms', votes: 8 },
        ],
        timestamp: '8 hours ago',
        likes: 67,
        comments: 9,
        shares: 2,
        isLiked: true,
        isPinned: false,
      },
      {
        id: 'post5',
        authorId: 'user5',
        authorName: 'Emma Wilson',
        authorImage: 'https://picsum.photos/50/50?random=15',
        authorRole: 'member',
        content: 'Check out my latest app built with React Native! 📱✨',
        type: 'image',
        images: [
          'https://picsum.photos/300/400?random=501',
          'https://picsum.photos/300/400?random=502',
          'https://picsum.photos/300/400?random=503',
        ],
        timestamp: '12 hours ago',
        likes: 156,
        comments: 34,
        shares: 15,
        isLiked: false,
        isPinned: false,
      },
    ]);
  }, [groupId]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleJoinGroup = () => {
    if (!groupInfo) return;

    if (groupInfo.privacy === 'private') {
      setGroupInfo(prev => prev ? { ...prev, isPending: true } : null);
      Alert.alert('Request Sent', 'Your request to join this private group has been sent to the admins.');
    } else {
      setGroupInfo(prev => prev ? { 
        ...prev, 
        isJoined: true, 
        membersCount: prev.membersCount + 1 
      } : null);
      Alert.alert('Joined!', `You have successfully joined ${groupInfo.name}`);
    }
  };

  const handleLeaveGroup = () => {
    if (!groupInfo) return;

    Alert.alert(
      'Leave Group',
      `Are you sure you want to leave ${groupInfo.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            setGroupInfo(prev => prev ? { 
              ...prev, 
              isJoined: false, 
              isPending: false,
              membersCount: Math.max(0, prev.membersCount - 1)
            } : null);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post: GroupPost = {
      id: `post_${Date.now()}`,
      authorId: 'me',
      authorName: 'You',
      authorImage: 'https://picsum.photos/50/50?random=me',
      authorRole: 'member',
      content: newPost.trim(),
      type: 'text',
      timestamp: 'just now',
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isPinned: false,
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setShowPostModal(false);
  };

  const handlePollVote = (postId: string, optionId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId && post.pollOptions) {
        return {
          ...post,
          pollOptions: post.pollOptions.map(option => 
            option.id === optionId 
              ? { ...option, votes: option.votes + 1 }
              : option
          )
        };
      }
      return post;
    }));
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const renderPost = (post: GroupPost) => (
    <View key={post.id} style={[styles.postCard, post.isPinned && styles.pinnedPost]}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image source={{ uri: post.authorImage }} style={styles.authorImage} />
        
        <View style={styles.authorInfo}>
          <View style={styles.authorNameRow}>
            <Text style={styles.authorName}>{post.authorName}</Text>
            <View style={[
              styles.roleBadge,
              post.authorRole === 'admin' && styles.adminBadge,
              post.authorRole === 'moderator' && styles.moderatorBadge,
            ]}>
              <Text style={styles.roleBadgeText}>
                {post.authorRole === 'admin' ? '👑 Admin' : 
                 post.authorRole === 'moderator' ? '⭐ Mod' : 'Member'}
              </Text>
            </View>
          </View>
          <Text style={styles.postTime}>{post.timestamp}</Text>
        </View>

        {post.isPinned && (
          <View style={styles.pinnedBadge}>
            <Text style={styles.pinnedIcon}>📌</Text>
          </View>
        )}
      </View>

      {/* Post Content */}
      <View style={styles.postContent}>
        {post.type === 'announcement' && (
          <View style={styles.announcementBadge}>
            <Text style={styles.announcementText}>📢 ANNOUNCEMENT</Text>
          </View>
        )}

        <Text style={styles.postText}>{post.content}</Text>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <View style={styles.imagesContainer}>
            {post.images.length === 1 ? (
              <Image source={{ uri: post.images[0] }} style={styles.singleImage} />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {post.images.map((image, index) => (
                  <Image 
                    key={index} 
                    source={{ uri: image }} 
                    style={styles.multipleImage} 
                  />
                ))}
              </ScrollView>
            )}
          </View>
        )}

        {/* Poll */}
        {post.pollOptions && (
          <View style={styles.pollContainer}>
            {post.pollOptions.map((option) => {
              const totalVotes = post.pollOptions?.reduce((sum, opt) => sum + opt.votes, 0) || 0;
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              
              return (
                <TouchableOpacity
                  key={option.id}
                  style={styles.pollOption}
                  onPress={() => handlePollVote(post.id, option.id)}
                >
                  <View style={[styles.pollBar, { width: `${percentage}%` }]} />
                  <View style={styles.pollContent}>
                    <Text style={styles.pollText}>{option.text}</Text>
                    <Text style={styles.pollVotes}>{option.votes} votes ({percentage.toFixed(1)}%)</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Event Info */}
        {post.eventInfo && (
          <View style={styles.eventContainer}>
            <Text style={styles.eventTitle}>{post.eventInfo.title}</Text>
            <Text style={styles.eventDetails}>📅 {post.eventInfo.date}</Text>
            <Text style={styles.eventDetails}>📍 {post.eventInfo.location}</Text>
            <Text style={styles.eventDetails}>👥 {post.eventInfo.attendees} attending</Text>
          </View>
        )}
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLikePost(post.id)}
        >
          <Text style={[styles.actionIcon, post.isLiked && styles.likedIcon]}>
            {post.isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.actionText}>{formatNumber(post.likes)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{formatNumber(post.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>{formatNumber(post.shares)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAboutTab = () => (
    <View style={styles.aboutContainer}>
      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.sectionContent}>{groupInfo?.description}</Text>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>Group Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatNumber(groupInfo?.membersCount || 0)}</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatNumber(groupInfo?.postsCount || 0)}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>Daily</Text>
            <Text style={styles.statLabel}>Activity</Text>
          </View>
        </View>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.tagsContainer}>
          {groupInfo?.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.aboutSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Group Rules</Text>
          <TouchableOpacity onPress={() => setShowRulesModal(true)}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {groupInfo?.rules.slice(0, 3).map((rule, index) => (
          <Text key={index} style={styles.ruleItem}>
            {index + 1}. {rule}
          </Text>
        ))}
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>Admin</Text>
        <View style={styles.adminContainer}>
          <Image source={{ uri: groupInfo?.adminInfo.image }} style={styles.adminImage} />
          <Text style={styles.adminName}>{groupInfo?.adminInfo.name}</Text>
          <Text style={styles.adminRole}>Group Creator</Text>
        </View>
      </View>
    </View>
  );

  if (!groupInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading group...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{groupInfo.name}</Text>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate('GroupChatScreen', { groupId })}
        >
          <Text style={styles.menuIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Group Cover */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: groupInfo.coverImage }} style={styles.coverImage} />
          <View style={styles.groupImageContainer}>
            <Image source={{ uri: groupInfo.image }} style={styles.groupImage} />
          </View>
        </View>

        {/* Group Info */}
        <View style={styles.groupInfoContainer}>
          <Text style={styles.groupName}>{groupInfo.name}</Text>
          <Text style={styles.groupCategory}>{groupInfo.category} • {groupInfo.privacy === 'private' ? 'Private' : 'Public'} Group</Text>
          <Text style={styles.groupStats}>
            {formatNumber(groupInfo.membersCount)} members
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {groupInfo.isJoined ? (
            <>
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => setShowPostModal(true)}
              >
                <Text style={styles.primaryButtonText}>Create Post</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={handleLeaveGroup}
              >
                <Text style={styles.secondaryButtonText}>Leave</Text>
              </TouchableOpacity>
            </>
          ) : groupInfo.isPending ? (
            <TouchableOpacity 
              style={[styles.actionButton, styles.pendingButton]}
              disabled
            >
              <Text style={styles.pendingButtonText}>Request Pending</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.actionButton, styles.joinButton]}
              onPress={handleJoinGroup}
            >
              <Text style={styles.joinButtonText}>
                {groupInfo.privacy === 'private' ? 'Request to Join' : 'Join Group'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {[
            { key: 'posts', label: 'Posts', count: posts.length },
            { key: 'about', label: 'About', count: null },
            { key: 'members', label: 'Members', count: groupInfo.membersCount },
            { key: 'events', label: 'Events', count: 3 },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText
              ]}>
                {tab.label}
                {tab.count !== null && ` (${formatNumber(tab.count)})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'posts' && groupInfo.isJoined && (
          <View style={styles.postsContainer}>
            {posts.map(renderPost)}
          </View>
        )}

        {activeTab === 'about' && (
          renderAboutTab()
        )}

        {activeTab === 'members' && (
          <View style={styles.membersContainer}>
            <TouchableOpacity 
              style={styles.viewMembersButton}
              onPress={() => navigation.navigate('GroupMembersScreen', { groupId })}
            >
              <Text style={styles.viewMembersText}>View All Members ({formatNumber(groupInfo.membersCount)})</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'events' && (
          <View style={styles.eventsContainer}>
            <Text style={styles.comingSoonText}>Events coming soon...</Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        visible={showPostModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPostModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Post</Text>
            <TouchableOpacity onPress={handleCreatePost}>
              <Text style={styles.modalPost}>Post</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TextInput
              style={styles.postInput}
              placeholder="What would you like to share with the group?"
              value={newPost}
              onChangeText={setNewPost}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Rules Modal */}
      <Modal
        visible={showRulesModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View />
            <Text style={styles.modalTitle}>Group Rules</Text>
            <TouchableOpacity onPress={() => setShowRulesModal(false)}>
              <Text style={styles.modalCancel}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {groupInfo.rules.map((rule, index) => (
              <View key={index} style={styles.ruleContainer}>
                <Text style={styles.ruleNumber}>{index + 1}</Text>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  coverContainer: {
    position: 'relative',
    height: 200,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  groupImageContainer: {
    position: 'absolute',
    bottom: -40,
    left: 16,
    borderWidth: 4,
    borderColor: '#ffffff',
    borderRadius: 50,
  },
  groupImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  groupInfoContainer: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
  },
  groupName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  groupCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  groupStats: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196f3',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    flex: 0.5,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: '#2196f3',
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  pendingButton: {
    backgroundColor: '#ff9800',
  },
  pendingButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196f3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2196f3',
    fontWeight: '600',
  },
  postsContainer: {
    marginTop: 8,
  },
  postCard: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    paddingVertical: 16,
  },
  pinnedPost: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  authorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  adminBadge: {
    backgroundColor: '#ff9800',
  },
  moderatorBadge: {
    backgroundColor: '#2196f3',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  postTime: {
    fontSize: 12,
    color: '#888',
  },
  pinnedBadge: {
    padding: 8,
  },
  pinnedIcon: {
    fontSize: 16,
  },
  postContent: {
    paddingHorizontal: 16,
  },
  announcementBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  announcementText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196f3',
  },
  postText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
  imagesContainer: {
    marginBottom: 12,
  },
  singleImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  multipleImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  pollContainer: {
    marginBottom: 12,
  },
  pollOption: {
    position: 'relative',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  pollBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  pollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pollText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  pollVotes: {
    fontSize: 12,
    color: '#666',
  },
  eventContainer: {
    backgroundColor: '#f8f9ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  postActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 24,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  likedIcon: {
    color: '#f44336',
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  aboutContainer: {
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  aboutSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  viewAllText: {
    fontSize: 16,
    color: '#2196f3',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2196f3',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#2196f3',
    fontWeight: '500',
  },
  ruleItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  adminContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  adminName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  adminRole: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  membersContainer: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    paddingVertical: 24,
    alignItems: 'center',
  },
  viewMembersButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  viewMembersText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  eventsContainer: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    paddingVertical: 60,
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666',
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
  modalPost: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  postInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  ruleContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  ruleNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196f3',
    marginRight: 12,
    minWidth: 24,
  },
  ruleText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 24,
  },
});