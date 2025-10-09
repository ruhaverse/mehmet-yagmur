import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  TextInput,
  Modal,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface Reel {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  isVerified?: boolean;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  musicTitle: string;
  musicArtist: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isFollowed: boolean;
  timestamp: string;
  hashtags: string[];
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

export default function ReelPlayerScreen({ navigation, route }: any) {
  const { initialReelIndex = 0 } = route.params || {};
  
  // Mock reels data
  const reelsData: Reel[] = [
    {
      id: 'r1',
      userId: 'u1',
      userName: 'travel_sarah',
      userImage: 'https://picsum.photos/60/60?random=10',
      isVerified: true,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnailUrl: 'https://picsum.photos/400/800?random=201',
      description: 'Beautiful sunset in Santorini! 🌅 #sunset #travel #greece',
      musicTitle: 'Summer Vibes',
      musicArtist: 'Chill Beats',
      likes: 1247,
      comments: 89,
      shares: 34,
      isLiked: false,
      isFollowed: false,
      timestamp: '2h',
      hashtags: ['#sunset', '#travel', '#greece']
    },
    {
      id: 'r2',
      userId: 'u2',
      userName: 'chef_mike',
      userImage: 'https://picsum.photos/60/60?random=11',
      isVerified: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      thumbnailUrl: 'https://picsum.photos/400/800?random=202',
      description: 'Quick pasta recipe that will blow your mind! 🍝 #cooking #pasta #recipe',
      musicTitle: 'Kitchen Beats',
      musicArtist: 'Food Music',
      likes: 892,
      comments: 156,
      shares: 67,
      isLiked: true,
      isFollowed: true,
      timestamp: '4h',
      hashtags: ['#cooking', '#pasta', '#recipe']
    },
    {
      id: 'r3',
      userId: 'u3',
      userName: 'fitness_anna',
      userImage: 'https://picsum.photos/60/60?random=12',
      isVerified: true,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnailUrl: 'https://picsum.photos/400/800?random=203',
      description: '10-minute morning workout routine 💪 #fitness #workout #morning',
      musicTitle: 'Pump It Up',
      musicArtist: 'Workout Music',
      likes: 2156,
      comments: 203,
      shares: 145,
      isLiked: false,
      isFollowed: false,
      timestamp: '6h',
      hashtags: ['#fitness', '#workout', '#morning']
    }
  ];

  const [currentReelIndex, setCurrentReelIndex] = useState(initialReelIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [reels, setReels] = useState(reelsData);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const currentReel = reels[currentReelIndex];

  // Mock comments data
  const mockComments: Comment[] = [
    {
      id: 'c1',
      userId: 'u10',
      userName: 'john_doe',
      userImage: 'https://picsum.photos/40/40?random=20',
      text: 'This is amazing! 🔥',
      timestamp: '2h',
      likes: 12,
      isLiked: false,
    },
    {
      id: 'c2',
      userId: 'u11',
      userName: 'jane_smith',
      userImage: 'https://picsum.photos/40/40?random=21',
      text: 'Love this content! Keep it up 👏',
      timestamp: '1h',
      likes: 8,
      isLiked: true,
    }
  ];

  const handleLike = () => {
    const updatedReels = [...reels];
    const reel = updatedReels[currentReelIndex];
    reel.isLiked = !reel.isLiked;
    reel.likes += reel.isLiked ? 1 : -1;
    setReels(updatedReels);
  };

  const handleFollow = () => {
    const updatedReels = [...reels];
    updatedReels[currentReelIndex].isFollowed = !updatedReels[currentReelIndex].isFollowed;
    setReels(updatedReels);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing reel by ${currentReel.userName}!\n${currentReel.description}`,
        url: currentReel.videoUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleComment = () => {
    setShowComments(true);
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      // Simulate sending comment
      console.log('Sending comment:', commentText);
      const updatedReels = [...reels];
      updatedReels[currentReelIndex].comments += 1;
      setReels(updatedReels);
      setCommentText('');
      setShowComments(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const reelIndex = Math.round(contentOffset.y / height);
    if (reelIndex !== currentReelIndex && reelIndex >= 0 && reelIndex < reels.length) {
      setCurrentReelIndex(reelIndex);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {reels.map((reel, index) => (
          <View key={reel.id} style={styles.reelContainer}>
            {/* Video Thumbnail */}
            <TouchableOpacity 
              style={styles.videoContainer}
              onPress={() => setIsPlaying(!isPlaying)}
              activeOpacity={1}
            >
              <Image 
                source={{ uri: reel.thumbnailUrl }} 
                style={styles.videoThumbnail}
                resizeMode="cover"
              />
              
              {/* Play/Pause Indicator */}
              {!isPlaying && (
                <View style={styles.playIndicator}>
                  <Text style={styles.playIcon}>▶️</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Right Side Actions */}
            <View style={styles.rightActions}>
              {/* User Profile */}
              <TouchableOpacity 
                style={styles.userProfileButton}
                onPress={() => navigation.navigate('Profile', { userId: reel.userId })}
              >
                <Image 
                  source={{ uri: reel.userImage }} 
                  style={styles.actionUserImage} 
                />
                {!reel.isFollowed && (
                  <TouchableOpacity 
                    style={styles.followButton}
                    onPress={handleFollow}
                  >
                    <Text style={styles.followIcon}>+</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {/* Like Button */}
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleLike}
              >
                <Text style={[styles.actionIcon, reel.isLiked && styles.likedIcon]}>
                  {reel.isLiked ? '❤️' : '🤍'}
                </Text>
                <Text style={styles.actionCount}>{formatNumber(reel.likes)}</Text>
              </TouchableOpacity>

              {/* Comment Button */}
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleComment}
              >
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionCount}>{formatNumber(reel.comments)}</Text>
              </TouchableOpacity>

              {/* Share Button */}
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Text style={styles.actionIcon}>📤</Text>
                <Text style={styles.actionCount}>{formatNumber(reel.shares)}</Text>
              </TouchableOpacity>

              {/* More Options */}
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>⋯</Text>
              </TouchableOpacity>

              {/* Music Icon (Rotating) */}
              <View style={styles.musicButton}>
                <Image 
                  source={{ uri: 'https://picsum.photos/30/30?random=music' }} 
                  style={styles.musicIcon} 
                />
              </View>
            </View>

            {/* Bottom Content */}
            <SafeAreaView style={styles.bottomContent}>
              {/* User Info */}
              <View style={styles.userInfo}>
                <TouchableOpacity 
                  style={styles.userNameContainer}
                  onPress={() => navigation.navigate('Profile', { userId: reel.userId })}
                >
                  <Text style={styles.userName}>@{reel.userName}</Text>
                  {reel.isVerified && (
                    <Text style={styles.verifiedIcon}>✓</Text>
                  )}
                </TouchableOpacity>
                
                {!reel.isFollowed && (
                  <TouchableOpacity 
                    style={styles.followTextButton}
                    onPress={handleFollow}
                  >
                    <Text style={styles.followText}>• Follow</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Description */}
              <Text style={styles.description} numberOfLines={3}>
                {reel.description}
              </Text>

              {/* Music Info */}
              <TouchableOpacity style={styles.musicInfo}>
                <Text style={styles.musicIcon}>🎵</Text>
                <Text style={styles.musicText} numberOfLines={1}>
                  {reel.musicTitle} • {reel.musicArtist}
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        ))}
      </ScrollView>

      {/* Top Navigation */}
      <SafeAreaView style={styles.topNavigation}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Reels</Text>
        <TouchableOpacity style={styles.cameraButton}>
          <Text style={styles.cameraIcon}>📷</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Comments Modal */}
      <Modal
        visible={showComments}
        transparent
        animationType="slide"
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.commentsContainer}>
            {/* Comments Header */}
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>
                Comments ({formatNumber(currentReel.comments)})
              </Text>
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            <ScrollView style={styles.commentsList}>
              {mockComments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Image 
                    source={{ uri: comment.userImage }} 
                    style={styles.commentUserImage} 
                  />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentUserName}>{comment.userName}</Text>
                      <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                    <View style={styles.commentActions}>
                      <TouchableOpacity style={styles.commentLike}>
                        <Text style={[
                          styles.commentLikeIcon,
                          comment.isLiked && styles.commentLikedIcon
                        ]}>
                          {comment.isLiked ? '❤️' : '🤍'}
                        </Text>
                        <Text style={styles.commentLikeCount}>{comment.likes}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text style={styles.commentReply}>Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
              <Image 
                source={{ uri: 'https://picsum.photos/32/32?random=0' }} 
                style={styles.commentInputUserImage} 
              />
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                value={commentText}
                onChangeText={setCommentText}
                placeholderTextColor="#999"
                multiline
              />
              <TouchableOpacity 
                style={styles.sendCommentButton}
                onPress={handleSendComment}
              >
                <Text style={styles.sendCommentText}>Post</Text>
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
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  reelContainer: {
    width,
    height,
    position: 'relative',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 20,
  },
  rightActions: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    alignItems: 'center',
  },
  userProfileButton: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  actionUserImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  followButton: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: '#ff3040',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followIcon: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  likedIcon: {
    color: '#ff3040',
  },
  actionCount: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  musicButton: {
    marginTop: 8,
  },
  musicIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 80,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  verifiedIcon: {
    fontSize: 14,
    color: '#2196f3',
    marginLeft: 4,
  },
  followTextButton: {
    marginLeft: 8,
  },
  followText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
    marginBottom: 12,
  },
  musicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 8,
    flex: 1,
  },
  topNavigation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  cameraButton: {
    padding: 8,
  },
  cameraIcon: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  commentsContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeIcon: {
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
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLike: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  commentLikeIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  commentLikedIcon: {
    color: '#ff3040',
  },
  commentLikeCount: {
    fontSize: 12,
    color: '#666',
  },
  commentReply: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  commentInputContainer: {
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
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    maxHeight: 80,
  },
  sendCommentButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  sendCommentText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});