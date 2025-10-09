import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface MediaItem {
  id: string;
  uri: string;
  type: 'photo' | 'video';
}

export default function AddPostScreen({ navigation, route }: any) {
  const { type } = route.params || {}; // 'post', 'story', 'reel'
  const [content, setContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [location, setLocation] = useState('');
  const [feeling, setFeeling] = useState('');
  const [taggedPeople, setTaggedPeople] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'only-me'>('public');

  const mockPhotos = [
    { id: '1', uri: 'https://picsum.photos/100/100?random=1', type: 'photo' as const },
    { id: '2', uri: 'https://picsum.photos/100/100?random=2', type: 'photo' as const },
    { id: '3', uri: 'https://picsum.photos/100/100?random=3', type: 'video' as const },
    { id: '4', uri: 'https://picsum.photos/100/100?random=4', type: 'photo' as const },
    { id: '5', uri: 'https://picsum.photos/100/100?random=5', type: 'photo' as const },
    { id: '6', uri: 'https://picsum.photos/100/100?random=6', type: 'video' as const },
  ];

  const feelings = [
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'excited', emoji: '🤩', label: 'Excited' },
    { id: 'grateful', emoji: '🙏', label: 'Grateful' },
    { id: 'relaxed', emoji: '😌', label: 'Relaxed' },
    { id: 'adventurous', emoji: '🤸', label: 'Adventurous' },
    { id: 'creative', emoji: '🎨', label: 'Creative' },
  ];

  const privacyOptions = [
    { key: 'public', label: 'Public', icon: '🌍', description: 'Anyone can see' },
    { key: 'friends', label: 'Friends', icon: '👥', description: 'Friends only' },
    { key: 'only-me', label: 'Only Me', icon: '🔒', description: 'Only you can see' },
  ];

  const handleMediaSelect = (media: MediaItem) => {
    if (type === 'story' && selectedMedia.length >= 1) {
      Alert.alert('Limit Reached', 'Stories can only have 1 media item');
      return;
    }
    
    if (selectedMedia.find(item => item.id === media.id)) {
      setSelectedMedia(prev => prev.filter(item => item.id !== media.id));
    } else {
      if (selectedMedia.length >= 10) {
        Alert.alert('Limit Reached', 'Maximum 10 media items allowed');
        return;
      }
      setSelectedMedia(prev => [...prev, media]);
    }
  };

  const handlePost = () => {
    if (!content.trim() && selectedMedia.length === 0) {
      Alert.alert('Error', 'Please add some content or media');
      return;
    }

    // Simulate posting
    Alert.alert(
      'Success!', 
      `${type === 'story' ? 'Story' : 'Post'} shared successfully!`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const getHeaderTitle = () => {
    switch (type) {
      case 'story':
        return 'Add Story';
      case 'reel':
        return 'Create Reel';
      default:
        return 'Create Post';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
        <TouchableOpacity 
          style={styles.postButton}
          onPress={handlePost}
        >
          <Text style={styles.postButtonText}>
            {type === 'story' ? 'Share' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userSection}>
          <Image 
            source={{ uri: 'https://picsum.photos/50/50?random=0' }} 
            style={styles.userImage} 
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>John Doe</Text>
            <TouchableOpacity style={styles.privacyButton}>
              <Text style={styles.privacyText}>
                {privacyOptions.find(p => p.key === privacy)?.icon} {' '}
                {privacyOptions.find(p => p.key === privacy)?.label}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Input */}
        <View style={styles.contentSection}>
          <TextInput
            style={styles.contentInput}
            placeholder={type === 'story' ? "What's your story?" : "What's on your mind?"}
            value={content}
            onChangeText={setContent}
            multiline
            placeholderTextColor="#999"
          />
        </View>

        {/* Selected Media Preview */}
        {selectedMedia.length > 0 && (
          <View style={styles.selectedMediaSection}>
            <Text style={styles.sectionTitle}>Selected Media ({selectedMedia.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.selectedMediaGrid}>
                {selectedMedia.map((media, index) => (
                  <View key={media.id} style={styles.selectedMediaItem}>
                    <Image source={{ uri: media.uri }} style={styles.selectedMediaImage} />
                    {media.type === 'video' && (
                      <View style={styles.videoIndicator}>
                        <Text style={styles.videoIcon}>▶</Text>
                      </View>
                    )}
                    <TouchableOpacity 
                      style={styles.removeMediaButton}
                      onPress={() => handleMediaSelect(media)}
                    >
                      <Text style={styles.removeMediaIcon}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Media Gallery */}
        <View style={styles.mediaSection}>
          <Text style={styles.sectionTitle}>Add Photos/Videos</Text>
          <View style={styles.mediaGrid}>
            {mockPhotos.map((media) => (
              <TouchableOpacity
                key={media.id}
                style={[
                  styles.mediaItem,
                  selectedMedia.find(item => item.id === media.id) && styles.selectedMediaItemBorder
                ]}
                onPress={() => handleMediaSelect(media)}
              >
                <Image source={{ uri: media.uri }} style={styles.mediaImage} />
                {media.type === 'video' && (
                  <View style={styles.videoIndicator}>
                    <Text style={styles.videoIcon}>▶</Text>
                  </View>
                )}
                {selectedMedia.find(item => item.id === media.id) && (
                  <View style={styles.selectedOverlay}>
                    <Text style={styles.selectedIcon}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Post Options */}
        {type !== 'story' && (
          <>
            {/* Location */}
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>📍</Text>
                <Text style={styles.optionLabel}>Add Location</Text>
              </View>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>

            {/* Feeling */}
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => navigation.navigate('FeelingAndActivity')}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>😊</Text>
                <Text style={styles.optionLabel}>
                  {feeling ? `Feeling ${feeling}` : 'Add Feeling/Activity'}
                </Text>
              </View>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>

            {/* Tag People */}
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => navigation.navigate('TagPeople')}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>👥</Text>
                <Text style={styles.optionLabel}>
                  {taggedPeople.length > 0 
                    ? `Tagged ${taggedPeople.length} people` 
                    : 'Tag People'
                  }
                </Text>
              </View>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>

            {/* Privacy */}
            <View style={styles.privacySection}>
              <Text style={styles.sectionTitle}>Who can see this?</Text>
              {privacyOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.privacyOption,
                    privacy === option.key && styles.selectedPrivacyOption
                  ]}
                  onPress={() => setPrivacy(option.key as any)}
                >
                  <Text style={styles.privacyIcon}>{option.icon}</Text>
                  <View style={styles.privacyContent}>
                    <Text style={styles.privacyLabel}>{option.label}</Text>
                    <Text style={styles.privacyDescription}>{option.description}</Text>
                  </View>
                  {privacy === option.key && (
                    <Text style={styles.selectedIndicator}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
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
  cancelButton: {
    padding: 4,
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  postButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  postButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  userImage: {
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
    marginBottom: 4,
  },
  privacyButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  privacyText: {
    fontSize: 12,
    color: '#666',
  },
  contentSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  contentInput: {
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectedMediaSection: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  selectedMediaGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  selectedMediaItem: {
    position: 'relative',
    marginRight: 8,
  },
  selectedMediaImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeMediaButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#f44336',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeMediaIcon: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mediaSection: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    marginBottom: 8,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 4,
  },
  mediaItem: {
    position: 'relative',
    width: (width - 48) / 3,
    height: (width - 48) / 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectedMediaItemBorder: {
    borderWidth: 3,
    borderColor: '#2196f3',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    color: '#ffffff',
    fontSize: 8,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(33, 150, 243, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
  },
  optionArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  privacySection: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    marginBottom: 8,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedPrivacyOption: {
    backgroundColor: '#f8f9ff',
  },
  privacyIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  privacyContent: {
    flex: 1,
  },
  privacyLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  privacyDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  selectedIndicator: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 32,
  },
});