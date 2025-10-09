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

interface InterestCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  interests: string[];
}

export default function SignupStepTwoScreen({ navigation, route }: any) {
  const { userInfo } = route.params || {};
  
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [isPublicProfile, setIsPublicProfile] = useState(true);

  const interestCategories: InterestCategory[] = [
    {
      id: 'tech',
      name: 'Technology',
      icon: '💻',
      color: '#2196f3',
      interests: ['Programming', 'AI/ML', 'Blockchain', 'Gaming', 'Gadgets', 'Startups']
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle',
      icon: '✨',
      color: '#e91e63',
      interests: ['Fashion', 'Beauty', 'Wellness', 'Fitness', 'Travel', 'Food']
    },
    {
      id: 'creative',
      name: 'Creative',
      icon: '🎨',
      color: '#9c27b0',
      interests: ['Art', 'Photography', 'Music', 'Writing', 'Design', 'Film']
    },
    {
      id: 'sports',
      name: 'Sports',
      icon: '⚽',
      color: '#4caf50',
      interests: ['Football', 'Basketball', 'Tennis', 'Swimming', 'Yoga', 'Running']
    },
    {
      id: 'business',
      name: 'Business',
      icon: '💼',
      color: '#ff9800',
      interests: ['Entrepreneurship', 'Marketing', 'Finance', 'Leadership', 'Networking', 'Sales']
    },
    {
      id: 'education',
      name: 'Education',
      icon: '📚',
      color: '#607d8b',
      interests: ['Science', 'History', 'Languages', 'Philosophy', 'Literature', 'Mathematics']
    }
  ];

  const profileImages = [
    'https://picsum.photos/150/150?random=1',
    'https://picsum.photos/150/150?random=2',
    'https://picsum.photos/150/150?random=3',
    'https://picsum.photos/150/150?random=4',
    'https://picsum.photos/150/150?random=5',
    'https://picsum.photos/150/150?random=6',
  ];

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(item => item !== interest);
      } else {
        if (prev.length >= 10) {
          Alert.alert('Limit Reached', 'You can select maximum 10 interests');
          return prev;
        }
        return [...prev, interest];
      }
    });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!profileImage) {
        Alert.alert('Required', 'Please select a profile image');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (bio.trim().length < 10) {
        Alert.alert('Required', 'Bio must be at least 10 characters');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (selectedInterests.length < 3) {
        Alert.alert('Required', 'Please select at least 3 interests');
        return;
      }
      setCurrentStep(4);
    } else {
      handleCompleteSignup();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleCompleteSignup = () => {
    const completeUserInfo = {
      ...userInfo,
      profileImage,
      bio,
      interests: selectedInterests,
      location,
      isPublicProfile
    };
    
    // Simulate API call
    setTimeout(() => {
      Alert.alert(
        'Success!',
        'Your account has been created successfully!',
        [{ text: 'Get Started', onPress: () => navigation.replace('MainTabs') }]
      );
    }, 1500);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${(currentStep / 4) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>Step {currentStep} of 4</Text>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose Your Profile Photo</Text>
      <Text style={styles.stepDescription}>
        Select a profile photo to help others recognize you
      </Text>

      <View style={styles.profileImageSection}>
        {profileImage ? (
          <View style={styles.selectedImageContainer}>
            <Image source={{ uri: profileImage }} style={styles.selectedImage} />
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={() => setProfileImage(null)}
            >
              <Text style={styles.changeImageText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageGrid}>
            {profileImages.map((imageUri, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageOption}
                onPress={() => setProfileImage(imageUri)}
              >
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.customImageButton}>
        <Text style={styles.customImageText}>📷 Upload Custom Photo</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tell Us About Yourself</Text>
      <Text style={styles.stepDescription}>
        Write a short bio that describes who you are
      </Text>

      <View style={styles.bioSection}>
        <TextInput
          style={styles.bioInput}
          placeholder="Write something about yourself..."
          value={bio}
          onChangeText={setBio}
          multiline
          maxLength={150}
          placeholderTextColor="#999"
        />
        <Text style={styles.characterCount}>{bio.length}/150</Text>
      </View>

      <View style={styles.locationSection}>
        <Text style={styles.sectionLabel}>Location (Optional)</Text>
        <TextInput
          style={styles.locationInput}
          placeholder="Where are you from?"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What Are Your Interests?</Text>
      <Text style={styles.stepDescription}>
        Select at least 3 interests to help us personalize your experience
      </Text>

      <View style={styles.selectedInterestsContainer}>
        <Text style={styles.selectedCount}>
          {selectedInterests.length} selected (min: 3, max: 10)
        </Text>
        {selectedInterests.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.selectedInterestsList}>
              {selectedInterests.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={styles.selectedInterestTag}
                  onPress={() => handleInterestToggle(interest)}
                >
                  <Text style={styles.selectedInterestText}>{interest}</Text>
                  <Text style={styles.removeInterestIcon}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      <ScrollView style={styles.categoriesContainer} showsVerticalScrollIndicator={false}>
        {interestCategories.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
            <View style={styles.interestsGrid}>
              {category.interests.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestTag,
                    selectedInterests.includes(interest) && styles.selectedTag,
                    { borderColor: category.color }
                  ]}
                  onPress={() => handleInterestToggle(interest)}
                >
                  <Text style={[
                    styles.interestText,
                    selectedInterests.includes(interest) && { color: category.color }
                  ]}>
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Privacy Settings</Text>
      <Text style={styles.stepDescription}>
        Choose who can see your profile and content
      </Text>

      <View style={styles.privacySection}>
        <TouchableOpacity
          style={[styles.privacyOption, isPublicProfile && styles.selectedPrivacyOption]}
          onPress={() => setIsPublicProfile(true)}
        >
          <View style={styles.privacyOptionContent}>
            <Text style={styles.privacyIcon}>🌍</Text>
            <View style={styles.privacyText}>
              <Text style={styles.privacyTitle}>Public Profile</Text>
              <Text style={styles.privacyDescription}>
                Anyone can see your profile and posts
              </Text>
            </View>
          </View>
          {isPublicProfile && <Text style={styles.checkIcon}>✓</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.privacyOption, !isPublicProfile && styles.selectedPrivacyOption]}
          onPress={() => setIsPublicProfile(false)}
        >
          <View style={styles.privacyOptionContent}>
            <Text style={styles.privacyIcon}>🔒</Text>
            <View style={styles.privacyText}>
              <Text style={styles.privacyTitle}>Private Profile</Text>
              <Text style={styles.privacyDescription}>
                Only friends can see your profile and posts
              </Text>
            </View>
          </View>
          {!isPublicProfile && <Text style={styles.checkIcon}>✓</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Account Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Profile Image:</Text>
          <Text style={styles.summaryValue}>Selected ✓</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Bio:</Text>
          <Text style={styles.summaryValue}>{bio.length} characters</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Interests:</Text>
          <Text style={styles.summaryValue}>{selectedInterests.length} selected</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Privacy:</Text>
          <Text style={styles.summaryValue}>{isPublicProfile ? 'Public' : 'Private'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Setup</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Step Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 4 ? 'Complete Setup' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
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
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  progressContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196f3',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  stepContainer: {
    padding: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  selectedImageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  changeImageButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  changeImageText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  imageOption: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  customImageButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  customImageText: {
    fontSize: 16,
    color: '#666',
  },
  bioSection: {
    marginBottom: 24,
  },
  bioInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  locationSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  locationInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedInterestsContainer: {
    marginBottom: 24,
  },
  selectedCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  selectedInterestsList: {
    flexDirection: 'row',
    gap: 8,
  },
  selectedInterestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196f3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedInterestText: {
    fontSize: 12,
    color: '#ffffff',
    marginRight: 4,
  },
  removeInterestIcon: {
    fontSize: 16,
    color: '#ffffff',
  },
  categoriesContainer: {
    maxHeight: 400,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },
  selectedTag: {
    backgroundColor: '#f0f8ff',
  },
  interestText: {
    fontSize: 14,
    color: '#333',
  },
  privacySection: {
    marginBottom: 32,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    marginBottom: 12,
  },
  selectedPrivacyOption: {
    borderColor: '#2196f3',
    backgroundColor: '#f0f8ff',
  },
  privacyOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  privacyIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  privacyText: {
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
  checkIcon: {
    fontSize: 18,
    color: '#2196f3',
  },
  summarySection: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  bottomActions: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  nextButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});