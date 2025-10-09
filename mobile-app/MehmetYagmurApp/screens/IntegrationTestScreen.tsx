import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface IntegrationTestScreenProps {
  navigation: any;
}

export default function IntegrationTestScreen({ navigation }: IntegrationTestScreenProps) {
  const testNavigationRoutes = [
    // Main Tab Screens
    { name: 'Home', title: 'Home Screen', section: 'Main Tabs' },
    { name: 'NewsFeed', title: 'News Feed', section: 'Main Tabs' },
    { name: 'Groups', title: 'Groups', section: 'Main Tabs' },
    { name: 'Media', title: 'Media Screen', section: 'Main Tabs' },
    { name: 'Chat', title: 'Chat', section: 'Main Tabs' },
    { name: 'Camera', title: 'Camera', section: 'Main Tabs' },
    { name: 'Notifications', title: 'Notifications', section: 'Main Tabs' },
    { name: 'Profile', title: 'Profile', section: 'Main Tabs' },
    { name: 'Settings', title: 'Settings', section: 'Main Tabs' },
    
    // Profile Related
    { name: 'Account', title: 'Account Screen', section: 'Profile' },
    { name: 'EditProfile', title: 'Edit Profile', section: 'Profile' },
    { name: 'AllFriends', title: 'All Friends', section: 'Profile' },
    { name: 'AddNewFriend', title: 'Add New Friend', section: 'Profile' },
    { name: 'ReceivedRequests', title: 'Received Requests', section: 'Profile' },
    { name: 'SentRequests', title: 'Sent Requests', section: 'Profile' },
    
    // Posts & Content
    { name: 'PostDetail', title: 'Post Detail', section: 'Content' },
    { name: 'AddPost', title: 'Add Post', section: 'Content' },
    { name: 'StoryView', title: 'Story View', section: 'Content' },
    { name: 'ReelPlayer', title: 'Reel Player', section: 'Content' },
    
    // Swap System
    { name: 'Swap', title: 'Swap Screen', section: 'Swap' },
    { name: 'SwapCheckout', title: 'Swap Checkout', section: 'Swap' },
    { name: 'SwapHistory', title: 'Swap History', section: 'Swap' },
    
    // Groups & Communities
    { name: 'GroupList', title: 'Group List', section: 'Groups' },
    { name: 'GroupScreen', title: 'Group Screen', section: 'Groups' },
    { name: 'GroupMembers', title: 'Group Members', section: 'Groups' },
    
    // Advanced Features
    { name: 'Search', title: 'Search Screen', section: 'Advanced' },
    { name: 'TagPeople', title: 'Tag People', section: 'Advanced' },
    { name: 'FeelingAndActivity', title: 'Feeling & Activity', section: 'Advanced' },
    { name: 'KeepHang', title: 'Keep Hang', section: 'Advanced' },
    { name: 'Test', title: 'Test Screen', section: 'Advanced' },
  ];

  const navigateToScreen = (routeName: string, title: string) => {
    try {
      navigation.navigate(routeName);
    } catch (error) {
      Alert.alert('Navigation Error', `Cannot navigate to ${title}: ${error}`);
    }
  };

  const groupedRoutes = testNavigationRoutes.reduce((acc, route) => {
    if (!acc[route.section]) {
      acc[route.section] = [];
    }
    acc[route.section].push(route);
    return acc;
  }, {} as Record<string, typeof testNavigationRoutes>);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 Integration Test Screen</Text>
        <Text style={styles.subtitle}>Test all navigation routes</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedRoutes).map(([section, routes]) => (
          <View key={section} style={styles.section}>
            <Text style={styles.sectionTitle}>{section}</Text>
            {routes.map(route => (
              <TouchableOpacity
                key={route.name}
                style={styles.routeButton}
                onPress={() => navigateToScreen(route.name, route.title)}
              >
                <Text style={styles.routeButtonText}>{route.title}</Text>
                <Text style={styles.routeName}>({route.name})</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>📊 Test Summary</Text>
          <Text style={styles.summaryText}>
            Total Routes: {testNavigationRoutes.length}
          </Text>
          <Text style={styles.summaryText}>
            Sections: {Object.keys(groupedRoutes).length}
          </Text>
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#2196f3',
  },
  routeButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  routeName: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  summary: {
    margin: 16,
    padding: 20,
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#388e3c',
    marginBottom: 4,
  },
  bottomPadding: {
    height: 20,
  },
});