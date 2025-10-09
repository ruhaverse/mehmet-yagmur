import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  PanGesturer,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface Story {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  mediaUrl: string;
  mediaType: 'photo' | 'video';
  timestamp: string;
  duration: number;
  isViewed: boolean;
  reactions?: {
    likes: number;
    comments: Comment[];
  };
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  text: string;
  timestamp: string;
}

interface StoryUser {
  id: string;
  name: string;
  image: string;
  stories: Story[];
}

export default function StoryViewScreen({ navigation, route }: any) {
  const { initialStoryIndex = 0, initialUserIndex = 0 } = route.params || {};
  
  // Mock data
  const storyUsers: StoryUser[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      image: 'https://picsum.photos/60/60?random=1',
      stories: [
        {
          id: 's1',
          userId: '1',
          userName: 'Alice Johnson',
          userImage: 'https://picsum.photos/60/60?random=1',
          mediaUrl: 'https://picsum.photos/400/800?random=101',
          mediaType: 'photo',
          timestamp: '2h',
          duration: 5000,
          isViewed: false,
          reactions: { likes: 24, comments: [] }
        },
        {
          id: 's2',
          userId: '1',
          userName: 'Alice Johnson',
          userImage: 'https://picsum.photos/60/60?random=1',
          mediaUrl: 'https://picsum.photos/400/800?random=102',
          mediaType: 'photo',
          timestamp: '1h',
          duration: 5000,
          isViewed: true,
          reactions: { likes: 31, comments: [] }
        }
      ]
    },
    {
      id: '2',
      name: 'Bob Wilson',
      image: 'https://picsum.photos/60/60?random=2',
      stories: [
        {
          id: 's3',
          userId: '2',
          userName: 'Bob Wilson',
          userImage: 'https://picsum.photos/60/60?random=2',
          mediaUrl: 'https://picsum.photos/400/800?random=103',
          mediaType: 'video',
          timestamp: '30m',
          duration: 8000,
          isViewed: false,
          reactions: { likes: 18, comments: [] }
        }
      ]
    },
    {
      id: '3',
      name: 'Carol Davis',
      image: 'https://picsum.photos/60/60?random=3',
      stories: [
        {
          id: 's4',
          userId: '3',
          userName: 'Carol Davis',
          userImage: 'https://picsum.photos/60/60?random=3',
          mediaUrl: 'https://picsum.photos/400/800?random=104',
          mediaType: 'photo',
          timestamp: '15m',
          duration: 5000,
          isViewed: false,
          reactions: { likes: 42, comments: [] }
        }
      ]
    }
  ];

  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [isPaused, setIsPaused] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showReactions, setShowReactions] = useState(false);
  const progressRef = useRef<Animated.CompositeAnimation | null>(null);

  const currentUser = storyUsers[currentUserIndex];
  const currentStory = currentUser?.stories[currentStoryIndex];

  useEffect(() => {
    if (currentStory && !isPaused) {
      startProgress();
    }
    return () => {
      if (progressRef.current) {
        progressRef.current.stop();
      }
    };
  }, [currentStory, currentUserIndex, currentStoryIndex, isPaused]);

  const startProgress = () => {
    if (progressRef.current) {
      progressRef.current.stop();
    }
    
    progress.setValue(0);
    
    progressRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: currentStory.duration,
      useNativeDriver: false,
    });

    progressRef.current.start(({ finished }) => {
      if (finished) {
        nextStory();
      }
    });
  };

  const nextStory = () => {
    const nextStoryIdx = currentStoryIndex + 1;
    
    if (nextStoryIdx < currentUser.stories.length) {
      setCurrentStoryIndex(nextStoryIdx);
      setProgress(new Animated.Value(0));
    } else {
      const nextUserIdx = currentUserIndex + 1;
      if (nextUserIdx < storyUsers.length) {
        setCurrentUserIndex(nextUserIdx);
        setCurrentStoryIndex(0);
        setProgress(new Animated.Value(0));
      } else {
        navigation.goBack();
      }
    }
  };

  const previousStory = () => {
    const prevStoryIdx = currentStoryIndex - 1;
    
    if (prevStoryIdx >= 0) {
      setCurrentStoryIndex(prevStoryIdx);
      setProgress(new Animated.Value(0));
    } else {
      const prevUserIdx = currentUserIndex - 1;
      if (prevUserIdx >= 0) {
        setCurrentUserIndex(prevUserIdx);
        setCurrentStoryIndex(storyUsers[prevUserIdx].stories.length - 1);
        setProgress(new Animated.Value(0));
      } else {
        navigation.goBack();
      }
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      progressRef.current?.stop();
    } else {
      startProgress();
    }
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      // Simulate sending comment
      console.log('Sending comment:', commentText);
      setCommentText('');
      setShowComments(false);
    }
  };

  const handleReaction = (reaction: string) => {
    console.log('Reaction:', reaction);
    setShowReactions(false);
  };

  if (!currentStory) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      
      {/* Story Image/Video */}
      <Image 
        source={{ uri: currentStory.mediaUrl }} 
        style={styles.storyMedia}
        resizeMode="cover"
      />

      {/* Top Gradient */}
      <View style={styles.topGradient} />

      {/* Progress Bars */}
      <SafeAreaView style={styles.progressContainer}>
        <View style={styles.progressBars}>
          {currentUser.stories.map((_, index) => (
            <View key={index} style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground} />
              <Animated.View
                style={[
                  styles.progressBarForeground,
                  {
                    width: index === currentStoryIndex 
                      ? progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        })
                      : index < currentStoryIndex ? '100%' : '0%'
                  }
                ]}
              />
            </View>
          ))}
        </View>
      </SafeAreaView>

      {/* Top Controls */}
      <SafeAreaView style={styles.topControls}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: currentStory.userImage }} 
            style={styles.userImage} 
          />
          <Text style={styles.userName}>{currentStory.userName}</Text>
          <Text style={styles.timestamp}>{currentStory.timestamp}</Text>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity 
            style={styles.pauseButton}
            onPress={togglePause}
          >
            <Text style={styles.actionIcon}>{isPaused ? '▶️' : '⏸️'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.actionIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Touch Areas for Navigation */}
      <View style={styles.touchAreasContainer}>
        <TouchableOpacity 
          style={styles.previousArea}
          onPress={previousStory}
          activeOpacity={1}
        />
        <TouchableOpacity 
          style={styles.nextArea}
          onPress={nextStory}
          activeOpacity={1}
        />
      </View>

      {/* Bottom Gradient */}
      <View style={styles.bottomGradient} />

      {/* Bottom Controls */}
      <SafeAreaView style={styles.bottomControls}>
        <View style={styles.reactionControls}>
          <TouchableOpacity 
            style={styles.reactionButton}
            onPress={() => setShowReactions(!showReactions)}
          >
            <Text style={styles.reactionIcon}>❤️</Text>
            {currentStory.reactions && (
              <Text style={styles.reactionCount}>{currentStory.reactions.likes}</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.commentButton}
            onPress={() => setShowComments(!showComments)}
          >
            <Text style={styles.commentIcon}>💬</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareIcon}>📤</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.messageInput}
          onPress={() => setShowComments(true)}
        >
          <Text style={styles.messageInputPlaceholder}>Send message</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Reactions Modal */}
      <Modal
        visible={showReactions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReactions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reactionsContainer}>
            <View style={styles.reactionsList}>
              {['❤️', '😂', '😮', '😢', '😡', '👍'].map((reaction) => (
                <TouchableOpacity
                  key={reaction}
                  style={styles.reactionItem}
                  onPress={() => handleReaction(reaction)}
                >
                  <Text style={styles.reactionEmoji}>{reaction}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Comments Modal */}
      <Modal
        visible={showComments}
        transparent
        animationType="slide"
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.commentsContainer}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Comments</Text>
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <Text style={styles.closeCommentsIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.commentsList}>
              {currentStory.reactions?.comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Image 
                    source={{ uri: comment.userImage }} 
                    style={styles.commentUserImage} 
                  />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentUserName}>{comment.userName}</Text>
                    <Text style={styles.commentText}>{comment.text}</Text>
                    <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                  </View>
                </View>
              )) || (
                <Text style={styles.noCommentsText}>No comments yet</Text>
              )}
            </ScrollView>
            
            <View style={styles.commentInput}>
              <Image 
                source={{ uri: 'https://picsum.photos/40/40?random=0' }} 
                style={styles.commentInputUserImage} 
              />
              <TextInput
                style={styles.commentInputField}
                placeholder="Add a comment..."
                value={commentText}
                onChangeText={setCommentText}
                placeholderTextColor="#999"
              />
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSendComment}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  storyMedia: {
    width,
    height,
    position: 'absolute',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  progressBars: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 4,
  },
  progressBarContainer: {
    flex: 1,
    height: 2,
    position: 'relative',
  },
  progressBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  progressBarForeground: {
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  topActions: {
    flexDirection: 'row',
    gap: 16,
  },
  pauseButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
  },
  actionIcon: {
    fontSize: 16,
    color: '#ffffff',
  },
  touchAreasContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  previousArea: {
    flex: 1,
  },
  nextArea: {
    flex: 1,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  reactionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  reactionIcon: {
    fontSize: 24,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  commentButton: {
    marginRight: 20,
  },
  commentIcon: {
    fontSize: 24,
  },
  shareButton: {},
  shareIcon: {
    fontSize: 24,
  },
  messageInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  messageInputPlaceholder: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  reactionsContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  reactionsList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  reactionItem: {
    alignItems: 'center',
    padding: 10,
  },
  reactionEmoji: {
    fontSize: 40,
  },
  commentsContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    paddingTop: 16,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeCommentsIcon: {
    fontSize: 18,
    color: '#666',
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  commentUserImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
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
    marginBottom: 4,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  noCommentsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 40,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  commentInputUserImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentInputField: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});