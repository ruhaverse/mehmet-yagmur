import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingsOption {
  id: string;
  title: string;
  description?: string;
  type: 'toggle' | 'navigate' | 'action';
  icon: string;
  value?: boolean;
  onPress?: () => void;
  destructive?: boolean;
}

interface SettingsSection {
  id: string;
  title: string;
  options: SettingsOption[];
}

export default function SettingsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: false,
    likes: true,
    comments: true,
    follows: true,
    messages: true,
    posts: false,
    stories: true,
  });

  const [privacy, setPrivacy] = useState({
    privateAccount: false,
    showOnlineStatus: true,
    showReadReceipts: true,
    allowTagging: true,
    allowMentions: true,
  });

  const [general, setGeneral] = useState({
    darkMode: false,
    highQualityUploads: true,
    autoPlayVideos: true,
    savePhotos: false,
    reduceMotion: false,
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    Alert.alert('Logged Out', 'You have been successfully logged out.');
    // Navigate to login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(false);
    Alert.alert(
      'Account Deletion Initiated',
      'Your account deletion request has been submitted. You have 30 days to cancel this request by logging back in.'
    );
  };

  const settingsSections: SettingsSection[] = [
    {
      id: 'account',
      title: 'Account',
      options: [
        {
          id: 'edit_profile',
          title: 'Edit Profile',
          description: 'Update your profile information',
          type: 'navigate',
          icon: '👤',
          onPress: () => navigation.navigate('EditProfileScreen'),
        },
        {
          id: 'change_password',
          title: 'Change Password',
          description: 'Update your password',
          type: 'navigate',
          icon: '🔒',
          onPress: () => navigation.navigate('ChangePasswordScreen'),
        },
        {
          id: 'verification',
          title: 'Account Verification',
          description: 'Verify your account with ID',
          type: 'navigate',
          icon: '✅',
          onPress: () => navigation.navigate('VerificationScreen'),
        },
        {
          id: 'linked_accounts',
          title: 'Linked Accounts',
          description: 'Connect social media accounts',
          type: 'navigate',
          icon: '🔗',
          onPress: () => navigation.navigate('LinkedAccountsScreen'),
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      options: [
        {
          id: 'push_notifications',
          title: 'Push Notifications',
          description: 'Receive notifications on your device',
          type: 'toggle',
          icon: '🔔',
          value: notifications.push,
          onPress: () => setNotifications(prev => ({ ...prev, push: !prev.push })),
        },
        {
          id: 'email_notifications',
          title: 'Email Notifications',
          description: 'Receive updates via email',
          type: 'toggle',
          icon: '📧',
          value: notifications.email,
          onPress: () => setNotifications(prev => ({ ...prev, email: !prev.email })),
        },
        {
          id: 'likes_notifications',
          title: 'Likes',
          description: 'When someone likes your posts',
          type: 'toggle',
          icon: '❤️',
          value: notifications.likes,
          onPress: () => setNotifications(prev => ({ ...prev, likes: !prev.likes })),
        },
        {
          id: 'comments_notifications',
          title: 'Comments',
          description: 'When someone comments on your posts',
          type: 'toggle',
          icon: '💬',
          value: notifications.comments,
          onPress: () => setNotifications(prev => ({ ...prev, comments: !prev.comments })),
        },
        {
          id: 'follows_notifications',
          title: 'New Followers',
          description: 'When someone follows you',
          type: 'toggle',
          icon: '👥',
          value: notifications.follows,
          onPress: () => setNotifications(prev => ({ ...prev, follows: !prev.follows })),
        },
        {
          id: 'messages_notifications',
          title: 'Messages',
          description: 'Direct messages and group chats',
          type: 'toggle',
          icon: '💌',
          value: notifications.messages,
          onPress: () => setNotifications(prev => ({ ...prev, messages: !prev.messages })),
        },
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      options: [
        {
          id: 'private_account',
          title: 'Private Account',
          description: 'Only approved followers can see your posts',
          type: 'toggle',
          icon: '🔐',
          value: privacy.privateAccount,
          onPress: () => setPrivacy(prev => ({ ...prev, privateAccount: !prev.privateAccount })),
        },
        {
          id: 'online_status',
          title: 'Show Online Status',
          description: 'Let others see when you\'re active',
          type: 'toggle',
          icon: '🟢',
          value: privacy.showOnlineStatus,
          onPress: () => setPrivacy(prev => ({ ...prev, showOnlineStatus: !prev.showOnlineStatus })),
        },
        {
          id: 'read_receipts',
          title: 'Read Receipts',
          description: 'Show when you\'ve read messages',
          type: 'toggle',
          icon: '👁️',
          value: privacy.showReadReceipts,
          onPress: () => setPrivacy(prev => ({ ...prev, showReadReceipts: !prev.showReadReceipts })),
        },
        {
          id: 'blocked_users',
          title: 'Blocked Users',
          description: 'Manage your blocked users list',
          type: 'navigate',
          icon: '🚫',
          onPress: () => navigation.navigate('BlockedUsersScreen'),
        },
        {
          id: 'two_factor',
          title: 'Two-Factor Authentication',
          description: 'Add extra security to your account',
          type: 'navigate',
          icon: '🛡️',
          onPress: () => navigation.navigate('TwoFactorScreen'),
        },
      ],
    },
    {
      id: 'content',
      title: 'Content & Display',
      options: [
        {
          id: 'dark_mode',
          title: 'Dark Mode',
          description: 'Use dark theme',
          type: 'toggle',
          icon: '🌙',
          value: general.darkMode,
          onPress: () => setGeneral(prev => ({ ...prev, darkMode: !prev.darkMode })),
        },
        {
          id: 'high_quality',
          title: 'High Quality Uploads',
          description: 'Upload photos and videos in best quality',
          type: 'toggle',
          icon: '📸',
          value: general.highQualityUploads,
          onPress: () => setGeneral(prev => ({ ...prev, highQualityUploads: !prev.highQualityUploads })),
        },
        {
          id: 'autoplay_videos',
          title: 'Auto-Play Videos',
          description: 'Automatically play videos in feed',
          type: 'toggle',
          icon: '▶️',
          value: general.autoPlayVideos,
          onPress: () => setGeneral(prev => ({ ...prev, autoPlayVideos: !prev.autoPlayVideos })),
        },
        {
          id: 'save_photos',
          title: 'Save Photos to Gallery',
          description: 'Automatically save uploaded photos',
          type: 'toggle',
          icon: '💾',
          value: general.savePhotos,
          onPress: () => setGeneral(prev => ({ ...prev, savePhotos: !prev.savePhotos })),
        },
        {
          id: 'reduce_motion',
          title: 'Reduce Motion',
          description: 'Limit animations for accessibility',
          type: 'toggle',
          icon: '♿',
          value: general.reduceMotion,
          onPress: () => setGeneral(prev => ({ ...prev, reduceMotion: !prev.reduceMotion })),
        },
      ],
    },
    {
      id: 'data',
      title: 'Data & Storage',
      options: [
        {
          id: 'data_usage',
          title: 'Data Usage',
          description: 'View your data consumption',
          type: 'navigate',
          icon: '📊',
          onPress: () => navigation.navigate('DataUsageScreen'),
        },
        {
          id: 'storage',
          title: 'Storage Management',
          description: 'Manage app storage and cache',
          type: 'navigate',
          icon: '💽',
          onPress: () => navigation.navigate('StorageScreen'),
        },
        {
          id: 'download_data',
          title: 'Download Your Data',
          description: 'Request a copy of your data',
          type: 'navigate',
          icon: '⬇️',
          onPress: () => navigation.navigate('DownloadDataScreen'),
        },
      ],
    },
    {
      id: 'support',
      title: 'Help & Support',
      options: [
        {
          id: 'help_center',
          title: 'Help Center',
          description: 'Get answers to common questions',
          type: 'navigate',
          icon: '❓',
          onPress: () => navigation.navigate('HelpCenterScreen'),
        },
        {
          id: 'contact_support',
          title: 'Contact Support',
          description: 'Get help from our support team',
          type: 'navigate',
          icon: '🎧',
          onPress: () => navigation.navigate('ContactSupportScreen'),
        },
        {
          id: 'report_problem',
          title: 'Report a Problem',
          description: 'Report bugs or issues',
          type: 'navigate',
          icon: '🐛',
          onPress: () => navigation.navigate('ReportProblemScreen'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          description: 'Share your thoughts and suggestions',
          type: 'navigate',
          icon: '💭',
          onPress: () => navigation.navigate('FeedbackScreen'),
        },
      ],
    },
    {
      id: 'legal',
      title: 'Legal & Policies',
      options: [
        {
          id: 'terms',
          title: 'Terms of Service',
          description: 'Read our terms and conditions',
          type: 'navigate',
          icon: '📜',
          onPress: () => navigation.navigate('TermsScreen'),
        },
        {
          id: 'privacy_policy',
          title: 'Privacy Policy',
          description: 'Learn how we handle your data',
          type: 'navigate',
          icon: '🔒',
          onPress: () => navigation.navigate('PrivacyPolicyScreen'),
        },
        {
          id: 'community_guidelines',
          title: 'Community Guidelines',
          description: 'Our community standards',
          type: 'navigate',
          icon: '👥',
          onPress: () => navigation.navigate('GuidelinesScreen'),
        },
      ],
    },
    {
      id: 'about',
      title: 'About',
      options: [
        {
          id: 'app_version',
          title: 'App Version',
          description: 'v2.1.0 (Build 2024.01.15)',
          type: 'action',
          icon: 'ℹ️',
        },
        {
          id: 'rate_app',
          title: 'Rate Our App',
          description: 'Leave a review on the app store',
          type: 'action',
          icon: '⭐',
          onPress: () => Alert.alert('Thank You!', 'Redirecting to app store...'),
        },
        {
          id: 'share_app',
          title: 'Share App',
          description: 'Invite friends to join',
          type: 'action',
          icon: '📤',
          onPress: () => Alert.alert('Share', 'Sharing options would open here'),
        },
      ],
    },
    {
      id: 'danger',
      title: 'Danger Zone',
      options: [
        {
          id: 'logout',
          title: 'Log Out',
          description: 'Sign out of your account',
          type: 'action',
          icon: '🚪',
          onPress: handleLogout,
        },
        {
          id: 'delete_account',
          title: 'Delete Account',
          description: 'Permanently delete your account',
          type: 'action',
          icon: '🗑️',
          destructive: true,
          onPress: handleDeleteAccount,
        },
      ],
    },
  ];

  const renderSettingsOption = (option: SettingsOption) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.settingOption,
        option.destructive && styles.destructiveOption,
      ]}
      onPress={option.onPress}
      disabled={option.type === 'action' && !option.onPress}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{option.icon}</Text>
        <View style={styles.settingInfo}>
          <Text style={[
            styles.settingTitle,
            option.destructive && styles.destructiveText,
          ]}>
            {option.title}
          </Text>
          {option.description && (
            <Text style={styles.settingDescription}>
              {option.description}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {option.type === 'toggle' && (
          <Switch
            value={option.value || false}
            onValueChange={option.onPress}
          />
        )}
        {option.type === 'navigate' && (
          <Text style={styles.chevron}>›</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSettingsSection = (section: SettingsSection) => (
    <View key={section.id} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.options.map(renderSettingsOption)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map(renderSettingsSection)}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Logout Modal */}
      <Modal
        visible={showLogoutModal}
        animationType="fade"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out of your account?
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.confirmButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        animationType="fade"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalMessage}>
              This action cannot be undone. Your account and all associated data will be permanently deleted after 30 days.
              {'\n\n'}
              You can cancel this request by logging back in within 30 days.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDeleteAccount}
              >
                <Text style={styles.deleteButtonText}>Delete Account</Text>
              </TouchableOpacity>
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
  backButton: {
    fontSize: 18,
    color: '#2196f3',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  destructiveOption: {
    backgroundColor: '#fff5f5',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  destructiveText: {
    color: '#f44336',
  },
  settingDescription: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    fontSize: 20,
    color: '#C7C7CC',
    fontWeight: '300',
  },
  bottomPadding: {
    height: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#2196f3',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});