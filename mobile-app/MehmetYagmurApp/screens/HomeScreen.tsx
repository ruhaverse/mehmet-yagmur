import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

export default function HomeScreen({ navigation }: any) {
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Mock stories data
    const mockStories: Story[] = [
      {
        id: '1',
        user: {
          name: 'Your Story',
          profilePicture: 'https://picsum.photos/60/60?random=1',
        },
        image: '',
        isViewed: false,
      },
      {
        id: '2',
        user: {
          name: 'Alice',
          profilePicture: 'https://picsum.photos/60/60?random=2',
        },
        image: 'https://picsum.photos/60/60?random=12',
        isViewed: false,
      },
      {
        id: '3',
        user: {
          name: 'Bob',
          profilePicture: 'https://picsum.photos/60/60?random=3',
        },
        image: 'https://picsum.photos/60/60?random=13',
        isViewed: true,
      },
      {
        id: '4',
        user: {
          name: 'Carol',
          profilePicture: 'https://picsum.photos/60/60?random=4',
        },
        image: 'https://picsum.photos/60/60?random=14',
        isViewed: false,
      },
    ];

    // Mock posts data
    const mockPosts: Post[] = [
      {
        id: '1',
        user: {
          name: 'John Doe',
          profilePicture: 'https://picsum.photos/40/40?random=5',
          isVerified: true,
        },
        content: 'Beautiful sunset at the beach! 🌅 Perfect way to end the day.',
        images: ['https://picsum.photos/350/200?random=20'],
        timestamp: '2 hours ago',
        likes: 124,
        comments: 18,
        shares: 5,
        isLiked: false,
      },
      {
        id: '2',
        user: {
          name: 'Sarah Smith',
          profilePicture: 'https://picsum.photos/40/40?random=6',
          isVerified: false,
        },
        content: 'Coffee time! ☕ Starting my day with a positive mindset and great energy.',
        images: ['https://picsum.photos/350/200?random=21'],
        timestamp: '4 hours ago',
        likes: 89,
        comments: 12,
        shares: 3,
        isLiked: true,
      },
      {
        id: '3',
        user: {
          name: 'Mike Johnson',
          profilePicture: 'https://picsum.photos/40/40?random=7',
          isVerified: true,
        },
        content: 'New adventure begins! Just arrived in Tokyo and the city is amazing! 🗼',
        images: [
          'https://picsum.photos/350/200?random=22',
          'https://picsum.photos/350/200?random=23'
        ],
        timestamp: '6 hours ago',
        likes: 256,
        comments: 32,
        shares: 15,
        isLiked: false,
      },
    ];

    setStories(mockStories);
    setPosts(mockPosts);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadData();
      setRefreshing(false);
    }, 1000);
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

  const renderStoryItem = (story: Story, index: number) => (
    <TouchableOpacity 
      key={story.id}
      style={styles.storyItem}
      activeOpacity={0.8}
    >
      <View style={[
        styles.storyImageContainer,
        story.isViewed && styles.viewedStory,
        story.id === '1' && styles.myStory
      ]}>
        {story.id === '1' ? (
          <View style={styles.addStoryContainer}>
            <Image 
              source={{ uri: story.user.profilePicture }} 
              style={styles.storyImage}
            />
            <View style={styles.addStoryIcon}>
              <Icon name="add" size={16} color="#ffffff" />
            </View>
          </View>
        ) : (
          <Image 
            source={{ uri: story.user.profilePicture }} 
            style={styles.storyImage}
          />
        )}
      </View>
      <Text style={styles.storyUserName}>{story.user.name}</Text>
    </TouchableOpacity>
  );

  const renderPost = (post: Post) => (
    <View key={post.id} style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <TouchableOpacity style={styles.postUserInfo}>
          <Image 
            source={{ uri: post.user.profilePicture }} 
            style={styles.postUserImage}
          />
          <View style={styles.postUserDetails}>
            <View style={styles.postUserNameContainer}>
              <Text style={styles.postUserName}>{post.user.name}</Text>
              {post.user.isVerified && (
                <Icon name="verified" size={16} color="#2196f3" />
              )}
            </View>
            <Text style={styles.postTimestamp}>{post.timestamp}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postMoreButton}>
          <Icon name="more-vert" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Post Images */}
      {post.images.length > 0 && (
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

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.postStats}>
          <Text style={styles.postStatsText}>
            {post.likes} likes • {post.comments} comments
          </Text>
        </View>
        
        <View style={styles.postActionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, post.isLiked && styles.likedButton]}
            onPress={() => handleLikePress(post.id)}
          >
            <Icon 
              name={post.isLiked ? "favorite" : "favorite-border"} 
              size={20} 
              color={post.isLiked ? "#e91e63" : "#666"} 
            />
            <Text style={[
              styles.actionButtonText,
              post.isLiked && styles.likedButtonText
            ]}>
              Like
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="comment" size={20} color="#666" />
            <Text style={styles.actionButtonText}>Comment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share" size={20} color="#666" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ShareUpTime</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('AddPost')}
          >
            <Icon name="add" size={24} color="#2196f3" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Chat')}
          >
            <Icon name="chat" size={24} color="#2196f3" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stories Section */}
        <View style={styles.storiesSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesContainer}
          >
            {stories.map(renderStoryItem)}
          </ScrollView>
        </View>

        {/* Posts Section */}
        <View style={styles.postsSection}>
          {posts.map(renderPost)}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  storiesSection: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  storyUserName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  postsSection: {
    paddingTop: 8,
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
  postTimestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  postMoreButton: {
    padding: 4,
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
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 8,
    resizeMode: 'cover',
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
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  likedButton: {
    backgroundColor: '#ffeef3',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  likedButtonText: {
    color: '#e91e63',
  },
  bottomPadding: {
    height: 20,
  },
});