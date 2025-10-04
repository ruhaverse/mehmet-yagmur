import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TabNavigation({ tabs }: { tabs: { name: string; component: React.ReactNode }[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.name} onPress={() => setActiveTab(tab.name)} style={styles.tabButton}>
            <Text style={activeTab === tab.name ? styles.activeTab : styles.inactiveTab}>{tab.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.content}>{tabs.find((tab) => tab.name === activeTab)?.component}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
  },
  tabButton: {
    padding: 10,
  },
  activeTab: {
    fontWeight: 'bold',
    color: '#000',
  },
  inactiveTab: {
    color: '#888',
  },
  content: {
    flex: 1,
    padding: 10,
  },
});