import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NewsFeedScreen from '../screens/NewsFeedScreen';
import AddPostScreen from '../screens/AddPostScreen';
import CommentsScreen from '../screens/CommentsScreen';
import AddReelScreen from '../screens/AddReelScreen';
import ReelPlayerScreen from '../screens/ReelPlayerScreen';
import StoryViewScreen from '../screens/StoryViewScreen';

const Stack = createStackNavigator();

export default function NewsFeedNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="NewsFeed" 
        component={NewsFeedScreen}
        options={{ title: 'Haber Akışı' }}
      />
      <Stack.Screen 
        name="AddPost" 
        component={AddPostScreen}
        options={{ title: 'Post Ekle' }}
      />
      <Stack.Screen 
        name="Comments" 
        component={CommentsScreen}
        options={{ title: 'Yorumlar' }}
      />
      <Stack.Screen 
        name="AddReel" 
        component={AddReelScreen}
        options={{ title: 'Reel Ekle' }}
      />
      <Stack.Screen 
        name="ReelPlayer" 
        component={ReelPlayerScreen}
        options={{ title: 'Reel', headerShown: false }}
      />
      <Stack.Screen 
        name="StoryView" 
        component={StoryViewScreen}
        options={{ title: 'Story', headerShown: false }}
      />
    </Stack.Navigator>
  );
}