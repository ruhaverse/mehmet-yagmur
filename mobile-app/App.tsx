import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {enableScreens} from 'react-native-screens';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Enable screens for better performance
enableScreens();

// Import screens
import MediaScreen from './screens/MediaScreen';
import NotificationScreen from './screens/NotificationScreen';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({route}) => ({
              headerShown: false,
              tabBarIcon: ({focused, color, size}) => {
                let iconName: string;

                if (route.name === 'Media') {
                  iconName = 'photo-library';
                } else if (route.name === 'Notifications') {
                  iconName = 'notifications';
                } else {
                  iconName = 'home';
                }

                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: '#8E8E93',
              tabBarStyle: {
                backgroundColor: '#FFFFFF',
                borderTopWidth: 0.5,
                borderTopColor: '#C6C6C8',
                paddingBottom: Platform.OS === 'ios' ? 20 : 5,
                paddingTop: 5,
                height: Platform.OS === 'ios' ? 85 : 65,
              },
            })}
          >
            <Tab.Screen 
              name="Media" 
              component={MediaScreen}
              options={{
                tabBarLabel: 'Media',
              }}
            />
            <Tab.Screen 
              name="Notifications" 
              component={NotificationScreen}
              options={{
                tabBarLabel: 'Bildirimler',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;