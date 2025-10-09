import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    bio: 'Love photography and traveling. Always looking for new adventures!',
    profilePicture: 'https://picsum.photos/120/120?random=1',
    coverPhoto: 'https://picsum.photos/400/200?random=2',
    followers: 1245,
    following: 567,
    posts: 89,
    isVerified: true,
  });

  const [activeTab, setActiveTab] = useState<'posts' | 'photos' | 'videos'>('posts');

  const posts = [
    { id: '1', image: 'https://picsum.photos/120/120?random=10', type: 'photo' },
    { id: '2', image: 'https://picsum.photos/120/120?random=11', type: 'photo' },
    { id: '3', image: 'https://picsum.photos/120/120?random=12', type: 'video' },
    { id: '4', image: 'https://picsum.photos/120/120?random=13', type: 'photo' },
    { id: '5', image: 'https://picsum.photos/120/120?random=14', type: 'photo' },
    { id: '6', image: 'https://picsum.photos/120/120?random=15', type: 'video' },
  ];

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'photos') return post.type === 'photo';
    if (activeTab === 'videos') return post.type === 'video';
    return true;
  });

  const itemSize = (width - 48) / 3; // 3 columns with padding

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Account')}
          style={styles.headerButton}
        >
          <Icon name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {user.firstName} {user.lastName}
        </Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Activity')}
          style={styles.headerButton}
        >
          <Icon name="notifications" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <View style={styles.coverPhotoContainer}>
          <Image 
            source={{ uri: user.coverPhoto }} 
            style={styles.coverPhoto}
          />
          <TouchableOpacity 
            style={styles.editCoverButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Icon name="camera-alt" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.profilePictureContainer}>
            <Image 
              source={{ uri: user.profilePicture }} 
              style={styles.profilePicture}
            />
            {user.isVerified && (
              <View style={styles.verifiedBadge}>
                <Icon name="verified" size={16} color="#2196f3" />
              </View>
            )}
          </View>
          
          <View style={styles.nameContainer}>
            <Text style={styles.fullName}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.username}>@{user.username}</Text>
          </View>

          <Text style={styles.bio}>{user.bio}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{user.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => navigation.navigate('AllFriends')}
            >
              <Text style={styles.statNumber}>{user.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => navigation.navigate('AllFriends')}
            >
              <Text style={styles.statNumber}>{user.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.shareProfileButton}
              onPress={() => {/* Share profile logic */}}
            >
              <Icon name="share" size={16} color="#2196f3" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('AllFriends')}
          >
            <View style={styles.quickActionIcon}>
              <Icon name="people" size={20} color="#2196f3" />
            </View>
            <Text style={styles.quickActionText}>Friends</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('Activity')}
          >
            <View style={styles.quickActionIcon}>
              <Icon name="favorite" size={20} color="#e91e63" />
            </View>
            <Text style={styles.quickActionText}>Activity</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => {/* Open saved posts */}}
          >
            <View style={styles.quickActionIcon}>
              <Icon name="bookmark" size={20} color="#ff9800" />
            </View>
            <Text style={styles.quickActionText}>Saved</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => {/* Open photos */}}
          >
            <View style={styles.quickActionIcon}>
              <Icon name="photo" size={20} color="#4caf50" />
            </View>
            <Text style={styles.quickActionText}>Photos</Text>
          </TouchableOpacity>
        </View>

        {/* Content Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Icon 
              name="grid-on" 
              size={20} 
              color={activeTab === 'posts' ? '#2196f3' : '#666'} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'posts' && styles.activeTabText
            ]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'photos' && styles.activeTab]}
            onPress={() => setActiveTab('photos')}
          >
            <Icon 
              name="photo" 
              size={20} 
              color={activeTab === 'photos' ? '#2196f3' : '#666'} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'photos' && styles.activeTabText
            ]}>
              Photos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
            onPress={() => setActiveTab('videos')}
          >
            <Icon 
              name="play-circle-filled" 
              size={20} 
              color={activeTab === 'videos' ? '#2196f3' : '#666'} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'videos' && styles.activeTabText
            ]}>
              Videos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsGrid}>
          {filteredPosts.map((post, index) => (
            <TouchableOpacity
              key={post.id}
              style={[styles.postItem, { width: itemSize, height: itemSize }]}
              activeOpacity={0.8}
            >
              <Image 
                source={{ uri: post.image }} 
                style={styles.postImage}
              />
              {post.type === 'video' && (
                <View style={styles.videoIndicator}>
                  <Icon name="play-circle-filled" size={20} color="#ffffff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {filteredPosts.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="photo-camera" size={64} color="#ddd" />
            <Text style={styles.emptyStateText}>
              {activeTab === 'photos' ? 'No photos yet' : 
               activeTab === 'videos' ? 'No videos yet' : 'No posts yet'}
            </Text>
            <Text style={styles.emptyStateSubText}>
              Share your moments with friends
            </Text>
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
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  coverPhotoContainer: {
    position: 'relative',
    height: 150,
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  editCoverButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
  },
  profileInfo: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    marginTop: -40,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profilePictureContainer: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 2,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  username: {
    fontSize: 16,
    color: '#666',
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editProfileButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  shareProfileButton: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196f3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2196f3',
    fontWeight: '600',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  postItem: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 32,
  },
});