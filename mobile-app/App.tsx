/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, Text, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen.tsx';
import HomeScreen from './src/screens/HomeScreen.tsx';
import AppForm from './app/components/forms/Form.js';
import HeaderWithBackArrow from './app/components/headers/HeaderWithBackArrow.js';
import Separator from './app/components/Separator.js';
import AddPostScreen from './app/screens/AddPostScreen.js';
import TestButton from './src/pages/TestButton.tsx';
import Screen from './src/components/Screen.tsx';
import { fetchData } from './src/lib/apiService.ts';
import AppNavigator from './navigation/AppNavigator.js';
import ProfileScreen from './screens/ProfileScreen.js';
import SettingsScreen from './screens/SettingsScreen.js';
import NotificationScreen from './screens/NotificationScreen.js';
import MediaScreen from './screens/MediaScreen.js';
import AddReelScreen from './screens/AddReelScreen.tsx';
import CommentsScreen from './screens/CommentsScreen.tsx';
import StoryViewScreen from './screens/StoryViewScreen.tsx';
import ReelPlayerScreen from './screens/ReelPlayerScreen.tsx';
import SwapScreen from './screens/SwapScreen.tsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import * as Sentry from '@sentry/react-native';
import axios from 'axios';

const Stack = createNativeStackNavigator();

Sentry.init({
  dsn: 'https://your-dsn-url@sentry.io/project-id',
  tracesSampleRate: 1.0,
});

// Backend base URL
const backendBaseUrl = 'http://localhost:3000';

// Example function to upload an image
const uploadImage = async (imageData: File) => {
  try {
    const response = await axios.post(`${backendBaseUrl}/upload`, imageData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Image uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Example function to fetch images
const fetchImages = async () => {
  try {
    const response = await axios.get(`${backendBaseUrl}/images`);
    console.log('Fetched images:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  React.useEffect(() => {
    const testAPI = async () => {
      try {
        const data = await fetchData('/test-endpoint');
        console.log('API Response:', data);
      } catch (error) {
        console.error('API Test Error:', error);
      }
    };

    testAPI();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <AppNavigator />
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="FormExample"
              component={() => (
                <AppForm
                  initialValues={{ name: '' }}
                  onSubmit={(values: { name: string }) => console.log(values)}
                  validationSchema={null}
                >
                  <Text>Form Example</Text>
                </AppForm>
              )}
            />
            <Stack.Screen
              name="HeaderExample"
              component={() => (
                <HeaderWithBackArrow
                  onBackButton={() => console.log('Back pressed')}
                  title="Example Header"
                  component={null}
                  leftComponent={null}
                  rightComponent={null}
                  titleStyle={{ fontSize: 20, fontWeight: 'bold' }}
                />
              )}
            />
            <Stack.Screen
              name="SeparatorExample"
              component={() => (
                <Separator text="Example Separator" style={{ marginVertical: 10 }} />
              )}
            />
            <Stack.Screen name="AddPost" component={AddPostScreen} />
            <Stack.Screen
              name="TestButton"
              component={TestButton}
            />
            <Stack.Screen
              name="ScreenExample"
              component={() => (
                <Screen>
                  <Text>Screen Component Example</Text>
                </Screen>
              )}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />
            <Stack.Screen name="Media" component={MediaScreen} />
            <Stack.Screen name="AddReel" component={AddReelScreen} />
            <Stack.Screen name="Comments" component={CommentsScreen} />
            <Stack.Screen name="StoryView" component={StoryViewScreen} />
            <Stack.Screen name="ReelPlayer" component={ReelPlayerScreen} />
            <Stack.Screen name="Swap" component={SwapScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
