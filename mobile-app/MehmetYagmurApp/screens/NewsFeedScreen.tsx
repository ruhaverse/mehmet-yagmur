import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Story {
  id: string;
  user: {
    name: string;
    profilePicture: string;
  };
  image: string;
  isViewed: boolean;
}

interface Post {
  id: string;
  user: {
    name: string;
    profilePicture: string;
    isVerified: boolean;
  };
  content: string;
  images: string[];
  videos?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  location?: string;
  type: 'post' | 'reel' | 'swap';
}

export default function NewsFeedScreen({ navigation }: any) {
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFeedData();
  }, []);

  const loadFeedData = () => {
    // Mock stories
    const mockStories: Story[] = [
      {
        id: '0',
        user: {
          name: 'Your Story',
          profilePicture: 'https://picsum.photos/60/60?random=1',
        },
        image: '',
        isViewed: false,
      },
      {
        id: '1',
        user: {
          name: 'Alice',
          profilePicture: 'https://picsum.photos/60/60?random=2',
        },
        image: 'https://picsum.photos/60/60?random=12',
        isViewed: false,
      },
      {
        id: '2',
        user: {
          name: 'Bob',
          profilePicture: 'https://picsum.photos/60/60?random=3',
        },
        image: 'https://picsum.photos/60/60?random=13',
        isViewed: true,
      },
      {
        id: '3',
        user: {
          name: 'Carol',
          profilePicture: 'https://picsum.photos/60/60?random=4',
        },
        image: 'https://picsum.photos/60/60?random=14',
        isViewed: false,
      },
      {
        id: '4',
        user: {
          name: 'David',
          profilePicture: 'https://picsum.photos/60/60?random=5',
        },
        image: 'https://picsum.photos/60/60?random=15',
        isViewed: false,
      },
    ];

    // Mock posts
    const mockPosts: Post[] = [
      {
        id: '1',
        user: {
          name: 'John Doe',
          profilePicture: 'https://picsum.photos/40/40?random=6',
          isVerified: true,
        },
        content: 'Beautiful sunset at the beach! 🌅 Perfect way to end the day. #sunset #beach #nature',
        images: ['https://picsum.photos/350/250?random=20'],
        timestamp: '2 hours ago',
        likes: 124,
        comments: 18,
        shares: 5,
        isLiked: false,
        isBookmarked: false,
        location: 'Malibu Beach, CA',
        type: 'post',
      },
      {
        id: '2',
        user: {
          name: 'Sarah Smith',
          profilePicture: 'https://picsum.photos/40/40?random=7',
          isVerified: false,
        },
        content: 'Coffee time! ☕ Starting my day with a positive mindset and great energy. Who else is ready to conquer today?',
        images: ['https://picsum.photos/350/250?random=21'],
        timestamp: '4 hours ago',
        likes: 89,
        comments: 12,
        shares: 3,
        isLiked: true,
        isBookmarked: false,
        type: 'post',
      },
      {
        id: '3',
        user: {
          name: 'Mike Johnson',
          profilePicture: 'https://picsum.photos/40/40?random=8',
          isVerified: true,
        },
        content: 'New adventure begins! Just arrived in Tokyo and the city is absolutely amazing! 🗼✈️',
        images: [
          'https://picsum.photos/350/250?random=22',
          'https://picsum.photos/350/250?random=23',
          'https://picsum.photos/350/250?random=24'
        ],
        timestamp: '6 hours ago',
        likes: 256,
        comments: 32,
        shares: 15,
        isLiked: false,
        isBookmarked: true,
        location: 'Tokyo, Japan',
        type: 'post',
      },
      {
        id: '4',
        user: {
          name: 'Emma Wilson',
          profilePicture: 'https://picsum.photos/40/40?random=9',
          isVerified: false,
        },
        content: 'Dancing in the rain! 💃🌧️ Sometimes the best moments are unplanned.',
        videos: ['https://picsum.photos/350/350?random=25'],
        timestamp: '8 hours ago',
        likes: 341,
        comments: 47,
        shares: 28,
        isLiked: true,
        isBookmarked: false,
        type: 'reel',
      },
      {
        id: '5',
        user: {
          name: 'Alex Turner',
          profilePicture: 'https://picsum.photos/40/40?random=10',
          isVerified: false,
        },
        content: 'Swap: iPhone 13 Pro for MacBook Air. Excellent condition, barely used! 📱💻',
        images: ['https://picsum.photos/350/250?random=26'],
        timestamp: '12 hours ago',
        likes: 67,
        comments: 23,
        shares: 8,
        isLiked: false,
        isBookmarked: false,
        type: 'swap',
      },
    ];

    setStories(mockStories);
    setPosts(mockPosts);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadFeedData();
      setRefreshing(false);
    }, 1500);
  };

  const handleLikePress = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleBookmarkPress = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  };

  const handleStoryPress = (story: Story) => {
    if (story.id === '0') {
      // Add story
      navigation.navigate('AddPost', { type: 'story' });
    } else {
      // View story
      navigation.navigate('StoryView', { storyId: story.id });
    }
  };

  const renderStoryItem = (story: Story, index: number) => (
    <TouchableOpacity 
      key={story.id}
      style={styles.storyItem}
      onPress={() => handleStoryPress(story)}
      activeOpacity={0.8}
    >
      <View style={[
        styles.storyImageContainer,
        story.isViewed && styles.viewedStory,
        story.id === '0' && styles.myStory
      ]}>
        {story.id === '0' ? (
          <View style={styles.addStoryContainer}>
            <Image 
              source={{ uri: story.user.profilePicture }} 
              style={styles.storyImage}
            />
            <View style={styles.addStoryIcon}>
              <Text style={styles.addStoryIconText}>+</Text>
            </View>
          </View>
        ) : (
          <Image 
            source={{ uri: story.user.profilePicture }} 
            style={styles.storyImage}
          />
        )}
      </View>
      <Text style={styles.storyUserName} numberOfLines={1}>
        {story.user.name}
      </Text>
    </TouchableOpacity>
  );

  const getPostTypeIcon = (type: Post['type']) => {
    switch (type) {
      case 'reel':
        return { icon: '▶', color: '#e91e63' };
      case 'swap':
        return { icon: '🔄', color: '#ff9800' };
      default:
        return null;
    }
  };

  const renderPost = (post: Post) => {
    const typeIcon = getPostTypeIcon(post.type);
    
    return (
      <View key={post.id} style={styles.postContainer}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <TouchableOpacity 
            style={styles.postUserInfo}
            onPress={() => navigation.navigate('Profile', { userId: post.user.name })}
          >
            <Image 
              source={{ uri: post.user.profilePicture }} 
              style={styles.postUserImage}
            />
            <View style={styles.postUserDetails}>
              <View style={styles.postUserNameContainer}>
                <Text style={styles.postUserName}>{post.user.name}</Text>
                {post.user.isVerified && (
                  <Text style={styles.verifiedIcon}>✓</Text>
                )}
                {typeIcon && (
                  <Text style={[styles.typeIcon, { color: typeIcon.color }]}>
                    {typeIcon.icon}
                  </Text>
                )}
              </View>
              <View style={styles.postMetaContainer}>
                <Text style={styles.postTimestamp}>{post.timestamp}</Text>
                {post.location && (
                  <>
                    <Text style={styles.locationDot}> • </Text>
                    <Text style={styles.postLocation}>{post.location}</Text>
                  </>
                )}
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.postMoreButton}>
            <Text style={styles.moreIcon}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <TouchableOpacity
          onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
          activeOpacity={1}
        >
          <Text style={styles.postContent}>{post.content}</Text>

          {/* Post Media */}
          {post.images && post.images.length > 0 && (
            <View style={styles.postImagesContainer}>
              {post.images.length === 1 ? (
                <Image 
                  source={{ uri: post.images[0] }} 
                  style={styles.singlePostImage}
                />
              ) : (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.multipleImagesScroll}
                  pagingEnabled
                >
                  {post.images.map((image, index) => (
                    <Image 
                      key={index}
                      source={{ uri: image }} 
                      style={styles.multiplePostImage}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {/* Video/Reel Content */}
          {post.videos && post.videos.length > 0 && (
            <TouchableOpacity
              style={styles.videoContainer}
              onPress={() => navigation.navigate('ReelPlayer', { reelId: post.id })}
            >
              <Image 
                source={{ uri: post.videos[0] }} 
                style={styles.videoThumbnail}
              />
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
              <View style={styles.reelBadge}>
                <Text style={styles.reelBadgeText}>REEL</Text>
              </View>
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <View style={styles.postStats}>
            <Text style={styles.postStatsText}>
              {post.likes} likes • {post.comments} comments • {post.shares} shares
            </Text>
          </View>
          
          <View style={styles.postActionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, post.isLiked && styles.likedButton]}
              onPress={() => handleLikePress(post.id)}
            >
              <Text style={[
                styles.actionButtonIcon,
                post.isLiked ? styles.likedIcon : styles.defaultIcon
              ]}>
                {post.isLiked ? '❤️' : '🤍'}
              </Text>
              <Text style={[
                styles.actionButtonText,
                post.isLiked && styles.likedButtonText
              ]}>
                Like
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
            >
              <Text style={styles.actionButtonIcon}>💬</Text>
              <Text style={styles.actionButtonText}>Comment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonIcon}>↗️</Text>
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bookmarkButton}
              onPress={() => handleBookmarkPress(post.id)}
            >
              <Text style={[
                styles.actionButtonIcon,
                post.isBookmarked ? styles.bookmarkedIcon : styles.defaultIcon
              ]}>
                {post.isBookmarked ? '🔖' : '📌'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ShareUpTime</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('AddPost')}
          >
            <Text style={styles.headerButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Activity')}
          >
            <Text style={styles.headerButtonText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.headerButtonText}>💬</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={[{ id: 'stories' }, ...posts]}
        renderItem={({ item }) => {
          if (item.id === 'stories') {
            return (
              <View style={styles.storiesSection}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.storiesContainer}
                >
                  {stories.map(renderStoryItem)}
                </ScrollView>
              </View>
            );
          }
          return renderPost(item as Post);
        }}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={() => <View style={styles.bottomPadding} />}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    minWidth: 36,
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 16,
  },
  storiesSection: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
  },
  storiesContainer: {
    paddingHorizontal: 16,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  storyImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#2196f3',
    padding: 2,
    marginBottom: 8,
  },
  viewedStory: {
    borderColor: '#ccc',
  },
  myStory: {
    borderColor: '#666',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  addStoryContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  addStoryIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196f3',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  addStoryIconText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  storyUserName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  postContainer: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    paddingBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  postUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postUserDetails: {
    flex: 1,
  },
  postUserNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  verifiedIcon: {
    fontSize: 14,
    color: '#2196f3',
    marginRight: 4,
  },
  typeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  postMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  postTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  locationDot: {
    fontSize: 12,
    color: '#666',
  },
  postLocation: {
    fontSize: 12,
    color: '#2196f3',
  },
  postMoreButton: {
    padding: 4,
  },
  moreIcon: {
    fontSize: 20,
    color: '#666',
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postImagesContainer: {
    marginBottom: 12,
  },
  singlePostImage: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  multipleImagesScroll: {
    paddingHorizontal: 16,
  },
  multiplePostImage: {
    width: width - 32,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
    resizeMode: 'cover',
  },
  videoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  videoThumbnail: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#ffffff',
    fontSize: 18,
  },
  reelBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#e91e63',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reelBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  postActions: {
    paddingHorizontal: 16,
  },
  postStats: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 8,
  },
  postStatsText: {
    fontSize: 12,
    color: '#666',
  },
  postActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  likedButton: {
    backgroundColor: '#ffeef3',
  },
  actionButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  defaultIcon: {
    opacity: 0.7,
  },
  likedIcon: {
    opacity: 1,
  },
  bookmarkedIcon: {
    opacity: 1,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  likedButtonText: {
    color: '#e91e63',
  },
  bookmarkButton: {
    padding: 8,
  },
  bottomPadding: {
    height: 20,
  },
});