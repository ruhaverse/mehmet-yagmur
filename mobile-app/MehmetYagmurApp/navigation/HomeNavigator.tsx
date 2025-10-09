import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Navigators
import AppNavigator from './AppNavigator';

// Individual Screens that need to be accessible from anywhere
import ActivityScreen from '../screens/ActivityScreen';
import AccountScreen from '../screens/AccountScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import AllFriendsScreen from '../screens/AllFriendsScreen';
import AddNewFriendScreen from '../screens/AddNewFriendScreen';
import ReceivedRequestsScreen from '../screens/ReceivedRequestsScreen';
import SentRequestsScreen from '../screens/SentRequestsScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import AddPostScreen from '../screens/AddPostScreen';
import StoryViewScreen from '../screens/StoryViewScreen';
import ReelPlayerScreen from '../screens/ReelPlayerScreen';
import SwapScreen from '../screens/SwapScreen';
import SwapCheckoutScreen from '../screens/SwapCheckoutScreen';
import TagPeopleScreen from '../screens/TagPeopleScreen';
import FeelingAndActivityScreen from '../screens/FeelingAndActivityScreen';
import KeepHangScreen from '../screens/KeepHangScreen';
import TestScreen from '../screens/TestScreen';

// Advanced Feature Screens
import SearchScreen from '../screens/SearchScreen';
import SwapHistoryScreen from '../screens/SwapHistoryScreen';
import GroupListScreen from '../screens/GroupListScreen';
import GroupScreen from '../screens/GroupScreen';
import GroupMembersScreen from '../screens/GroupMembersScreen';
import IntegrationTestScreen from '../screens/IntegrationTestScreen';
import FinalVerificationScreen from '../screens/FinalVerificationScreen';

const Stack = createStackNavigator();

export default function HomeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main App Tabs */}
      <Stack.Screen 
        name="MainTabs" 
        component={AppNavigator}
      />
      
      {/* Profile Related */}
      <Stack.Screen 
        name="Account" 
        component={AccountScreen}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
      />
      <Stack.Screen 
        name="Activity" 
        component={ActivityScreen}
      />
      <Stack.Screen 
        name="AllFriends" 
        component={AllFriendsScreen}
      />
      <Stack.Screen 
        name="AddNewFriend" 
        component={AddNewFriendScreen}
      />
      <Stack.Screen 
        name="ReceivedRequests" 
        component={ReceivedRequestsScreen}
      />
      <Stack.Screen 
        name="SentRequests" 
        component={SentRequestsScreen}
      />
      
      {/* Posts & Content */}
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen}
      />
      <Stack.Screen 
        name="AddPost" 
        component={AddPostScreen}
      />
      <Stack.Screen 
        name="StoryView" 
        component={StoryViewScreen}
      />
      <Stack.Screen 
        name="ReelPlayer" 
        component={ReelPlayerScreen}
      />
      
      {/* Swap System */}
      <Stack.Screen 
        name="Swap" 
        component={SwapScreen}
      />
      <Stack.Screen 
        name="SwapCheckout" 
        component={SwapCheckoutScreen}
      />
      <Stack.Screen 
        name="SwapHistory" 
        component={SwapHistoryScreen}
      />
      
      {/* Groups & Communities */}
      <Stack.Screen 
        name="GroupList" 
        component={GroupListScreen}
      />
      <Stack.Screen 
        name="GroupScreen" 
        component={GroupScreen}
      />
      <Stack.Screen 
        name="GroupMembers" 
        component={GroupMembersScreen}
      />
      
      {/* Advanced Features */}
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
      />
      <Stack.Screen 
        name="TagPeople" 
        component={TagPeopleScreen}
      />
      <Stack.Screen 
        name="FeelingAndActivity" 
        component={FeelingAndActivityScreen}
      />
      <Stack.Screen 
        name="KeepHang" 
        component={KeepHangScreen}
      />
      <Stack.Screen 
        name="Test" 
        component={TestScreen}
      />
      <Stack.Screen 
        name="IntegrationTest" 
        component={IntegrationTestScreen}
      />
      <Stack.Screen 
        name="FinalVerification" 
        component={FinalVerificationScreen}
      />
    </Stack.Navigator>
  );
}