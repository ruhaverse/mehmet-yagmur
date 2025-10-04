import React from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import routes from "./routes";
import ChatRoomScreen from "../screens/ChatRoomScreen";
import MessagesScreen from "../screens/MessagesScreen";
import ChatTestScreen from "../screens/ChatTestScreen";
import AddNewFriendScreen from "../screens/AddNewFriendScreen";
import TestScreen from "../screens/TestScreen";

export default function MessagesNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={routes.MESSAGES} component={MessagesScreen} />
      <Stack.Screen name={routes.CHAT_ROOM} component={ChatRoomScreen} />
      <Stack.Screen
        name={routes.Add_NEW_FRIEND}
        component={AddNewFriendScreen}
      />
      <Stack.Screen name="Test" component={TestScreen} />

      {/* <Stack.Screen name="ChatTest" component={ChatTestScreen} /> */}
    </Stack.Navigator>
  );
}
