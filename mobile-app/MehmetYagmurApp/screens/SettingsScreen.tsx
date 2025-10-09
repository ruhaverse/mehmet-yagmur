import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SettingsScreen({ navigation }: any) {
  const menuItems = [
    {
      icon: 'person',
      title: 'Account Settings',
      subtitle: 'Privacy, security, change password',
      onPress: () => navigation.navigate('Account'),
    },
    {
      icon: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      onPress: () => {},
    },
    {
      icon: 'security',
      title: 'Privacy & Security',
      subtitle: 'Control your privacy settings',
      onPress: () => {},
    },
    {
      icon: 'language',
      title: 'Language',
      subtitle: 'English',
      onPress: () => {},
    },
    {
      icon: 'dark-mode',
      title: 'Dark Mode',
      subtitle: 'Switch between light and dark theme',
      onPress: () => {},
    },
    {
      icon: 'storage',
      title: 'Data Usage',
      subtitle: 'Manage your data consumption',
      onPress: () => {},
    },
    {
      icon: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact us',
      onPress: () => {},
    },
    {
      icon: 'info',
      title: 'About',
      subtitle: 'App info and version',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <TouchableOpacity 
          style={styles.profileSection}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image 
            source={{ uri: 'https://picsum.photos/60/60?random=1' }} 
            style={styles.profilePicture}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileStatus}>View profile</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#666" />
        </TouchableOpacity>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Icon name={item.icon} size={20} color="#2196f3" />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>ShareUpTime</Text>
          <Text style={styles.versionNumber}>Version 1.0.0</Text>
        </View>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 16,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196f3',
    marginBottom: 4,
  },
  versionNumber: {
    fontSize: 12,
    color: '#999',
  },
});