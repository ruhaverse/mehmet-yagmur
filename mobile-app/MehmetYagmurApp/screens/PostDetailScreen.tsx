import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Comment {
  id: string;
  user: {
    name: string;
    profilePicture: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
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
  location?: string;
}

export default function PostDetailScreen({ navigation, route }: any) {
  const { postId } = route.params || {};
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadPostDetail();
  }, [postId]);

  const loadPostDetail = () => {
    // Mock post data
    const mockPost: Post = {
      id: postId || '1',
      user: {
        name: 'John Doe',
        profilePicture: 'https://picsum.photos/40/40?random=6',
        isVerified: true,
      },
      content: 'Beautiful sunset at the beach! 🌅 Perfect way to end the day. There\'s something magical about watching the sun disappear into the horizon while listening to the waves crash against the shore. #sunset #beach #nature #peaceful',
      images: ['https://picsum.photos/350/250?random=20'],
      timestamp: '2 hours ago',
      likes: 124,
      comments: 18,
      shares: 5,
      isLiked: false,
      location: 'Malibu Beach, CA',
    };

    const mockComments: Comment[] = [
      {
        id: '1',
        user: {
          name: 'Alice Johnson',
          profilePicture: 'https://picsum.photos/32/32?random=1',
        },
        content: 'Absolutely stunning! I love how the colors blend together.',
        timestamp: '1 hour ago',
        likes: 12,
        isLiked: false,
      },
      {
        id: '2',
        user: {
          name: 'Bob Smith',
          profilePicture: 'https://picsum.photos/32/32?random=2',
        },
        content: 'This makes me want to visit the beach right now! 🏖️',
        timestamp: '45 minutes ago',
        likes: 8,
        isLiked: true,
      },
      {
        id: '3',
        user: {
          name: 'Carol Davis',
          profilePicture: 'https://picsum.photos/32/32?random=3',
        },
        content: 'Nature at its finest! Thanks for sharing this beautiful moment with us.',
        timestamp: '30 minutes ago',
        likes: 5,
        isLiked: false,
      },
      {
        id: '4',
        user: {
          name: 'David Wilson',
          profilePicture: 'https://picsum.photos/32/32?random=4',
        },
        content: 'The perfect golden hour shot! What camera did you use?',
        timestamp: '15 minutes ago',
        likes: 3,
        isLiked: false,
      },
    ];

    setPost(mockPost);
    setComments(mockComments);
  };

  const handleLikePost = () => {
    if (!post) return;
    
    setPost(prev => prev ? {
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    } : null);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            }
          : comment
      )
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !post) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        profilePicture: 'https://picsum.photos/32/32?random=0',
      },
      content: newComment.trim(),
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
    };

    setComments(prev => [comment, ...prev]);
    setPost(prev => prev ? { ...prev, comments: prev.comments + 1 } : null);
    setNewComment('');
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image source={{ uri: item.user.profilePicture }} style={styles.commentUserImage} />
      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <Text style={styles.commentUserName}>{item.user.name}</Text>
          <Text style={styles.commentText}>{item.content}</Text>
        </View>
        <View style={styles.commentActions}>
          <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
          <TouchableOpacity 
            style={styles.commentLikeButton}
            onPress={() => handleLikeComment(item.id)}
          >
            <Text style={[
              styles.commentLikeText,
              item.isLiked && styles.commentLikedText
            ]}>
              {item.isLiked ? '❤️' : '🤍'} {item.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentReplyButton}>
            <Text style={styles.commentReplyText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Post Content */}
          <View style={styles.postContainer}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <TouchableOpacity style={styles.postUserInfo}>
                <Image source={{ uri: post.user.profilePicture }} style={styles.postUserImage} />
                <View style={styles.postUserDetails}>
                  <View style={styles.postUserNameContainer}>
                    <Text style={styles.postUserName}>{post.user.name}</Text>
                    {post.user.isVerified && (
                      <Text style={styles.verifiedIcon}>✓</Text>
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
            <Text style={styles.postContent}>{post.content}</Text>

            {/* Post Images */}
            {post.images && post.images.length > 0 && (
              <View style={styles.postImagesContainer}>
                {post.images.map((image, index) => (
                  <Image 
                    key={index}
                    source={{ uri: image }} 
                    style={styles.postImage}
                  />
                ))}
              </View>
            )}

            {/* Post Stats */}
            <View style={styles.postStats}>
              <Text style={styles.postStatsText}>
                {post.likes} likes • {post.comments} comments • {post.shares} shares
              </Text>
            </View>

            {/* Post Actions */}
            <View style={styles.postActionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, post.isLiked && styles.likedButton]}
                onPress={handleLikePost}
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
              
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonIcon}>💬</Text>
                <Text style={styles.actionButtonText}>Comment</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonIcon}>↗️</Text>
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsSectionTitle}>
              Comments ({comments.length})
            </Text>
            
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View style={styles.commentInputContainer}>
          <Image 
            source={{ uri: 'https://picsum.photos/32/32?random=0' }} 
            style={styles.commentInputUserImage} 
          />
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            style={[
              styles.commentSendButton,
              newComment.trim() ? styles.commentSendButtonActive : {}
            ]}
            onPress={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Text style={[
              styles.commentSendButtonText,
              newComment.trim() ? styles.commentSendButtonTextActive : {}
            ]}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  backText: {
    fontSize: 16,
    color: '#2196f3',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  shareButton: {
    padding: 4,
  },
  shareText: {
    fontSize: 16,
    color: '#2196f3',
  },
  scrollContainer: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: '#ffffff',
    paddingBottom: 16,
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  postUserImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  verifiedIcon: {
    fontSize: 16,
    color: '#2196f3',
  },
  postMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  postTimestamp: {
    fontSize: 14,
    color: '#666',
  },
  locationDot: {
    fontSize: 14,
    color: '#666',
  },
  postLocation: {
    fontSize: 14,
    color: '#2196f3',
  },
  postMoreButton: {
    padding: 8,
  },
  moreIcon: {
    fontSize: 24,
    color: '#666',
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  postImagesContainer: {
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  postStats: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 12,
  },
  postStatsText: {
    fontSize: 14,
    color: '#666',
  },
  postActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  likedButton: {
    backgroundColor: '#ffeef3',
  },
  actionButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  defaultIcon: {
    opacity: 0.7,
  },
  likedIcon: {
    opacity: 1,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  likedButtonText: {
    color: '#e91e63',
  },
  commentsSection: {
    backgroundColor: '#ffffff',
    paddingTop: 16,
  },
  commentsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  commentUserImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    marginTop: 4,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#666',
    marginRight: 16,
  },
  commentLikeButton: {
    marginRight: 16,
  },
  commentLikeText: {
    fontSize: 12,
    color: '#666',
  },
  commentLikedText: {
    color: '#e91e63',
  },
  commentReplyButton: {},
  commentReplyText: {
    fontSize: 12,
    color: '#2196f3',
    fontWeight: '500',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  commentInputUserImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    marginBottom: 4,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  commentSendButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  commentSendButtonActive: {
    backgroundColor: '#2196f3',
  },
  commentSendButtonText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  commentSendButtonTextActive: {
    color: '#ffffff',
  },
});