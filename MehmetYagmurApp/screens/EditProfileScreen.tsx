import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  website: string;
  location: string;
  dateOfBirth: string;
  profileImage: string;
  coverImage: string;
  isPrivate: boolean;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  joinDate: string;
  interests: string[];
  socialLinks: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };
}

interface InterestCategory {
  id: string;
  name: string;
  icon: string;
  items: string[];
}

export default function EditProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<UserProfile>({
    id: 'user1',
    username: 'john_doe',
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 (555) 123-4567',
    bio: 'Digital creator passionate about technology, photography, and travel. Always exploring new adventures! 🌍📸',
    website: 'https://johndoe.com',
    location: 'San Francisco, CA',
    dateOfBirth: '1995-03-15',
    profileImage: 'https://picsum.photos/400/400?random=1',
    coverImage: 'https://picsum.photos/800/400?random=2',
    isPrivate: false,
    isVerified: true,
    followersCount: 12540,
    followingCount: 892,
    postsCount: 347,
    joinDate: '2020-01-15',
    interests: ['Technology', 'Photography', 'Travel', 'Food', 'Music', 'Gaming'],
    socialLinks: {
      twitter: '@johndoe',
      instagram: '@johndoe_photo',
      linkedin: 'john-doe-tech',
      facebook: 'john.doe.photographer',
    },
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [showImagePicker, setShowImagePicker] = useState<'profile' | 'cover' | null>(null);
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setSaving] = useState(false);

  const interestCategories: InterestCategory[] = [
    {
      id: 'technology',
      name: 'Technology',
      icon: '💻',
      items: ['Programming', 'AI/ML', 'Blockchain', 'Gadgets', 'Software', 'Hardware'],
    },
    {
      id: 'creative',
      name: 'Creative',
      icon: '🎨',
      items: ['Photography', 'Design', 'Art', 'Music', 'Writing', 'Video Editing'],
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle',
      icon: '🌟',
      items: ['Travel', 'Food', 'Fashion', 'Fitness', 'Health', 'Beauty'],
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: '🎮',
      items: ['Gaming', 'Movies', 'TV Shows', 'Books', 'Podcasts', 'Streaming'],
    },
    {
      id: 'business',
      name: 'Business',
      icon: '💼',
      items: ['Entrepreneurship', 'Marketing', 'Finance', 'Leadership', 'Networking', 'Innovation'],
    },
    {
      id: 'sports',
      name: 'Sports',
      icon: '⚽',
      items: ['Football', 'Basketball', 'Tennis', 'Swimming', 'Running', 'Cycling'],
    },
  ];

  useEffect(() => {
    const profileChanged = JSON.stringify(profile) !== JSON.stringify(editedProfile);
    setHasChanges(profileChanged);
  }, [profile, editedProfile]);

  const handleSave = async () => {
    if (!editedProfile.displayName.trim()) {
      Alert.alert('Error', 'Display name is required');
      return;
    }

    if (!editedProfile.username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    if (editedProfile.bio.length > 150) {
      Alert.alert('Error', 'Bio must be less than 150 characters');
      return;
    }

    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      setProfile(editedProfile);
      setSaving(false);
      setHasChanges(false);
      Alert.alert('Success', 'Profile updated successfully!');
    }, 2000);
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              setEditedProfile(profile);
              navigation.goBack();
            }
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleImageSelect = (type: 'profile' | 'cover') => {
    setShowImagePicker(type);
    // Simulate image picker
    setTimeout(() => {
      const newImage = `https://picsum.photos/${type === 'profile' ? '400/400' : '800/400'}?random=${Date.now()}`;
      setEditedProfile(prev => ({
        ...prev,
        [type === 'profile' ? 'profileImage' : 'coverImage']: newImage,
      }));
      setShowImagePicker(null);
    }, 1000);
  };

  const toggleInterest = (interest: string) => {
    setEditedProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const renderInterestCategories = () => {
    return interestCategories.map((category) => (
      <View key={category.id} style={styles.interestCategory}>
        <Text style={styles.interestCategoryTitle}>
          {category.icon} {category.name}
        </Text>
        <View style={styles.interestItems}>
          {category.items.map((item) => {
            const isSelected = editedProfile.interests.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[styles.interestItem, isSelected && styles.selectedInterest]}
                onPress={() => toggleInterest(item)}
              >
                <Text style={[
                  styles.interestItemText,
                  isSelected && styles.selectedInterestText
                ]}>
                  {item}
                </Text>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          disabled={!hasChanges || loading}
        >
          <Text style={[
            styles.saveButton,
            (!hasChanges || loading) && styles.disabledButton
          ]}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.coverSection}>
          <Image source={{ uri: editedProfile.coverImage }} style={styles.coverImage} />
          <TouchableOpacity 
            style={styles.editCoverButton}
            onPress={() => handleImageSelect('cover')}
          >
            <Text style={styles.editImageIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: editedProfile.profileImage }} style={styles.profileImage} />
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => handleImageSelect('profile')}
            >
              <Text style={styles.editImageIcon}>📷</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Display Name *</Text>
            <TextInput
              style={styles.textInput}
              value={editedProfile.displayName}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, displayName: text }))}
              placeholder="Enter your display name"
              maxLength={30}
            />
            <Text style={styles.charCount}>{editedProfile.displayName.length}/30</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username *</Text>
            <TextInput
              style={styles.textInput}
              value={editedProfile.username}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, username: text.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
              placeholder="Enter your username"
              maxLength={20}
              autoCapitalize="none"
            />
            <Text style={styles.charCount}>{editedProfile.username.length}/20</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.textInput, styles.bioInput]}
              value={editedProfile.bio}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, bio: text }))}
              placeholder="Tell us about yourself..."
              maxLength={150}
              multiline
              numberOfLines={3}
            />
            <Text style={styles.charCount}>{editedProfile.bio.length}/150</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Website</Text>
            <TextInput
              style={styles.textInput}
              value={editedProfile.website}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, website: text }))}
              placeholder="https://yourwebsite.com"
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.textInput}
              value={editedProfile.location}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, location: text }))}
              placeholder="City, Country"
            />
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={editedProfile.email}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, email: text }))}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.textInput}
              value={editedProfile.phoneNumber}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, phoneNumber: text }))}
              placeholder="+1 (555) 123-4567"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Interests ({editedProfile.interests.length})</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setShowInterestsModal(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.interestsPreview}>
            {editedProfile.interests.slice(0, 6).map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestTagText}>{interest}</Text>
              </View>
            ))}
            {editedProfile.interests.length > 6 && (
              <View style={styles.interestTag}>
                <Text style={styles.interestTagText}>+{editedProfile.interests.length - 6}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Social Links</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setShowSocialModal(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.socialLinks}>
            {Object.entries(editedProfile.socialLinks).map(([platform, handle]) => (
              handle && (
                <View key={platform} style={styles.socialLink}>
                  <Text style={styles.socialIcon}>
                    {platform === 'twitter' ? '🐦' : 
                     platform === 'instagram' ? '📷' : 
                     platform === 'linkedin' ? '💼' : 
                     platform === 'facebook' ? '👥' : '🔗'}
                  </Text>
                  <Text style={styles.socialHandle}>{handle}</Text>
                </View>
              )
            ))}
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <View style={styles.privacyOption}>
            <View style={styles.privacyInfo}>
              <Text style={styles.privacyTitle}>Private Account</Text>
              <Text style={styles.privacyDescription}>
                When your account is private, only people you approve can see your posts
              </Text>
            </View>
            <Switch
              value={editedProfile.isPrivate}
              onValueChange={(value) => setEditedProfile(prev => ({ ...prev, isPrivate: value }))}
            />
          </View>
        </View>

        {/* Account Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{editedProfile.postsCount.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{editedProfile.followersCount.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{editedProfile.followingCount.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <View style={styles.joinInfo}>
            <Text style={styles.joinText}>
              Member since {new Date(editedProfile.joinDate).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Interests Modal */}
      <Modal
        visible={showInterestsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowInterestsModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Interests</Text>
            <TouchableOpacity onPress={() => setShowInterestsModal(false)}>
              <Text style={styles.modalDone}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalDescription}>
              Choose topics you're interested in to personalize your experience
            </Text>
            
            {renderInterestCategories()}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Social Links Modal */}
      <Modal
        visible={showSocialModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSocialModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Social Links</Text>
            <TouchableOpacity onPress={() => setShowSocialModal(false)}>
              <Text style={styles.modalDone}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalDescription}>
              Add your social media handles to connect with others
            </Text>

            <View style={styles.socialInputGroup}>
              <Text style={styles.socialInputIcon}>🐦</Text>
              <View style={styles.socialInputContainer}>
                <Text style={styles.socialInputLabel}>Twitter</Text>
                <TextInput
                  style={styles.socialInput}
                  value={editedProfile.socialLinks.twitter || ''}
                  onChangeText={(text) => setEditedProfile(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, twitter: text }
                  }))}
                  placeholder="@username"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.socialInputGroup}>
              <Text style={styles.socialInputIcon}>📷</Text>
              <View style={styles.socialInputContainer}>
                <Text style={styles.socialInputLabel}>Instagram</Text>
                <TextInput
                  style={styles.socialInput}
                  value={editedProfile.socialLinks.instagram || ''}
                  onChangeText={(text) => setEditedProfile(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, instagram: text }
                  }))}
                  placeholder="@username"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.socialInputGroup}>
              <Text style={styles.socialInputIcon}>💼</Text>
              <View style={styles.socialInputContainer}>
                <Text style={styles.socialInputLabel}>LinkedIn</Text>
                <TextInput
                  style={styles.socialInput}
                  value={editedProfile.socialLinks.linkedin || ''}
                  onChangeText={(text) => setEditedProfile(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, linkedin: text }
                  }))}
                  placeholder="username"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.socialInputGroup}>
              <Text style={styles.socialInputIcon}>👥</Text>
              <View style={styles.socialInputContainer}>
                <Text style={styles.socialInputLabel}>Facebook</Text>
                <TextInput
                  style={styles.socialInput}
                  value={editedProfile.socialLinks.facebook || ''}
                  onChangeText={(text) => setEditedProfile(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, facebook: text }
                  }))}
                  placeholder="username"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker !== null}
        animationType="fade"
        transparent
      >
        <View style={styles.imagePickerOverlay}>
          <View style={styles.imagePickerModal}>
            <Text style={styles.imagePickerTitle}>
              {showImagePicker === 'profile' ? 'Profile Photo' : 'Cover Photo'}
            </Text>
            <Text style={styles.imagePickerMessage}>Selecting new image...</Text>
            <View style={styles.loadingIndicator}>
              <Text style={styles.loadingText}>📷</Text>
            </View>
          </View>
        </View>
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
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '600',
  },
  disabledButton: {
    color: '#ccc',
  },
  content: {
    flex: 1,
  },
  coverSection: {
    position: 'relative',
    height: 200,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editCoverButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editImageIcon: {
    fontSize: 20,
  },
  profileImageSection: {
    alignItems: 'center',
    marginTop: -60,
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 14,
    color: '#2196f3',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  interestsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  interestTagText: {
    fontSize: 14,
    color: '#2196f3',
    fontWeight: '500',
  },
  socialLinks: {
    gap: 12,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  socialHandle: {
    fontSize: 16,
    color: '#333',
  },
  privacyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  privacyInfo: {
    flex: 1,
    marginRight: 12,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  joinInfo: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  joinText: {
    fontSize: 14,
    color: '#999',
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
  modalDone: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  interestCategory: {
    marginBottom: 24,
  },
  interestCategoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  interestItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedInterest: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  interestItemText: {
    fontSize: 14,
    color: '#333',
  },
  selectedInterestText: {
    color: '#2196f3',
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 12,
    color: '#2196f3',
    marginLeft: 6,
  },
  socialInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
  },
  socialInputIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  socialInputContainer: {
    flex: 1,
  },
  socialInputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  socialInput: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  imagePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerModal: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 200,
  },
  imagePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  imagePickerMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  loadingIndicator: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 32,
  },
});