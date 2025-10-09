// Asset Usage Examples - Demonstrates how to use the new asset system
// This shows integration patterns for all asset components

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

// Import our asset system
import {
  TabIcons,
  AppLogo,
  FEELINGS_DATA,
  ACTIVITIES_DATA,
  AnimatedFeeling,
  GoogleIcon,
  FacebookIcon,
  LinkedInIcon,
  AlternativeRegistrationContainer,
  FeatureIcons,
  ASSET_CONFIG,
} from './index';

const AssetShowcase: React.FC = () => {
  const [selectedFeeling, setSelectedFeeling] = useState<number>(1);
  const [selectedActivity, setSelectedActivity] = useState<number>(1);

  const handleSocialLogin = (platform: string) => {
    Alert.alert(`${platform} Login`, `${platform} login pressed`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header with App Logo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Logo</Text>
        <View style={styles.logoContainer}>
          <AppLogo size={100} />
        </View>
      </View>

      {/* Tab Navigation Icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tab Navigation Icons</Text>
        <View style={styles.iconGrid}>
          <View style={styles.iconItem}>
            <TabIcons.HomeIcon size={ASSET_CONFIG.ICON_SIZES.TAB} />
            <Text style={styles.iconLabel}>Home</Text>
          </View>
          <View style={styles.iconItem}>
            <TabIcons.GroupsIcon size={ASSET_CONFIG.ICON_SIZES.TAB} />
            <Text style={styles.iconLabel}>Groups</Text>
          </View>
          <View style={styles.iconItem}>
            <TabIcons.AddIcon size={ASSET_CONFIG.ICON_SIZES.TAB} />
            <Text style={styles.iconLabel}>Add</Text>
          </View>
          <View style={styles.iconItem}>
            <TabIcons.ApertureIcon size={ASSET_CONFIG.ICON_SIZES.TAB} />
            <Text style={styles.iconLabel}>Aperture</Text>
          </View>
          <View style={styles.iconItem}>
            <TabIcons.ShareIcon size={ASSET_CONFIG.ICON_SIZES.TAB} />
            <Text style={styles.iconLabel}>Share</Text>
          </View>
          <View style={styles.iconItem}>
            <TabIcons.UserIcon size={ASSET_CONFIG.ICON_SIZES.TAB} />
            <Text style={styles.iconLabel}>User</Text>
          </View>
        </View>
      </View>

      {/* Animated Feelings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Animated Feelings</Text>
        <View style={styles.feelingsContainer}>
          {FEELINGS_DATA.map((feeling) => (
            <TouchableOpacity
              key={feeling.id}
              style={[
                styles.feelingItem,
                selectedFeeling === feeling.id && styles.selectedFeelingItem
              ]}
              onPress={() => setSelectedFeeling(feeling.id)}
            >
              <AnimatedFeeling
                feeling={feeling}
                size={ASSET_CONFIG.ICON_SIZES.LARGE}
                isActive={selectedFeeling === feeling.id}
              />
              <Text style={styles.feelingLabel}>{feeling.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activities</Text>
        <View style={styles.activitiesContainer}>
          {ACTIVITIES_DATA.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={[
                styles.activityItem,
                { backgroundColor: activity.color + '20' },
                selectedActivity === activity.id && styles.selectedActivityItem
              ]}
              onPress={() => setSelectedActivity(activity.id)}
            >
              <Text style={[styles.activityEmoji, { color: activity.color }]}>
                {activity.emoji}
              </Text>
              <Text style={styles.activityLabel}>{activity.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Social Login Icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Social Login</Text>
        <AlternativeRegistrationContainer
          onGooglePress={() => handleSocialLogin('Google')}
          onFacebookPress={() => handleSocialLogin('Facebook')}
          onLinkedInPress={() => handleSocialLogin('LinkedIn')}
          iconSize={50}
        />
        
        <Text style={styles.subSectionTitle}>Individual Social Icons</Text>
        <View style={styles.socialIconsRow}>
          <GoogleIcon 
            size={40} 
            onPress={() => handleSocialLogin('Google')}
            style={styles.socialIcon}
          />
          <FacebookIcon 
            size={40} 
            onPress={() => handleSocialLogin('Facebook')}
            style={styles.socialIcon}
          />
          <LinkedInIcon 
            size={40} 
            onPress={() => handleSocialLogin('LinkedIn')}
            style={styles.socialIcon}
          />
        </View>
      </View>

      {/* Feature Icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feature Icons</Text>
        <View style={styles.featureIconsGrid}>
          <View style={styles.featureIconItem}>
            <FeatureIcons.ShareFeed size={ASSET_CONFIG.ICON_SIZES.LARGE} />
            <Text style={styles.featureIconLabel}>Share Feed</Text>
          </View>
          <View style={styles.featureIconItem}>
            <FeatureIcons.SwapPoint size={ASSET_CONFIG.ICON_SIZES.LARGE} />
            <Text style={styles.featureIconLabel}>Swap Point</Text>
          </View>
          <View style={styles.featureIconItem}>
            <FeatureIcons.ShareTime size={ASSET_CONFIG.ICON_SIZES.LARGE} />
            <Text style={styles.featureIconLabel}>Share Time</Text>
          </View>
          <View style={styles.featureIconItem}>
            <FeatureIcons.AddFriends size={ASSET_CONFIG.ICON_SIZES.LARGE} />
            <Text style={styles.featureIconLabel}>Add Friends</Text>
          </View>
          <View style={styles.featureIconItem}>
            <FeatureIcons.Reels size={ASSET_CONFIG.ICON_SIZES.LARGE} />
            <Text style={styles.featureIconLabel}>Reels</Text>
          </View>
          <View style={styles.featureIconItem}>
            <FeatureIcons.SavedSwap size={ASSET_CONFIG.ICON_SIZES.LARGE} />
            <Text style={styles.featureIconLabel}>Saved Swap</Text>
          </View>
          <View style={styles.featureIconItem}>
            <FeatureIcons.Help size={ASSET_CONFIG.ICON_SIZES.LARGE} />
            <Text style={styles.featureIconLabel}>Help</Text>
          </View>
          <View style={styles.featureIconItem}>
            <FeatureIcons.Tag size={ASSET_CONFIG.ICON_SIZES.LARGE} />
            <Text style={styles.featureIconLabel}>Tag</Text>
          </View>
          <View style={styles.featureIconItem}>
            <FeatureIcons.Gift size={ASSET_CONFIG.ICON_SIZES.LARGE} />
            <Text style={styles.featureIconLabel}>Gift</Text>
          </View>
          <View style={styles.featureIconItem}>
            <FeatureIcons.Food size={ASSET_CONFIG.ICON_SIZES.LARGE} />
            <Text style={styles.featureIconLabel}>Food</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ASSET_CONFIG.COLORS.LIGHT_GRAY,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: ASSET_CONFIG.COLORS.DARK_GRAY,
    textAlign: 'center',
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: ASSET_CONFIG.COLORS.GRAY,
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  iconItem: {
    alignItems: 'center',
    margin: 10,
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 12,
    color: ASSET_CONFIG.COLORS.GRAY,
  },
  feelingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  feelingItem: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    margin: 5,
    backgroundColor: ASSET_CONFIG.COLORS.LIGHT_GRAY,
  },
  selectedFeelingItem: {
    backgroundColor: ASSET_CONFIG.COLORS.PRIMARY + '20',
    borderWidth: 2,
    borderColor: ASSET_CONFIG.COLORS.PRIMARY,
  },
  feelingLabel: {
    marginTop: 5,
    fontSize: 12,
    color: ASSET_CONFIG.COLORS.DARK_GRAY,
    fontWeight: '500',
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  activityItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    margin: 5,
    minWidth: 80,
  },
  selectedActivityItem: {
    borderWidth: 2,
    borderColor: ASSET_CONFIG.COLORS.PRIMARY,
  },
  activityEmoji: {
    fontSize: 24,
  },
  activityLabel: {
    marginTop: 5,
    fontSize: 12,
    color: ASSET_CONFIG.COLORS.DARK_GRAY,
    fontWeight: '500',
  },
  socialIconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    marginHorizontal: 10,
  },
  featureIconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  featureIconItem: {
    alignItems: 'center',
    margin: 8,
    padding: 8,
    minWidth: 80,
  },
  featureIconLabel: {
    marginTop: 5,
    fontSize: 11,
    color: ASSET_CONFIG.COLORS.GRAY,
    textAlign: 'center',
  },
});

export default AssetShowcase;