import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Animated } from "react-native";

const colors = {
  primary: '#007AFF',
  white: '#FFFFFF',
  text: '#000000',
  background: '#F8F8F8',
  border: '#E0E0E0',
};

interface TabMenu {
  name: string;
  component: React.ReactNode;
  icon?: string;
  badge?: number;
}

interface TabNavigationProps {
  tabMenus: TabMenu[];
  initTab?: string;
  style?: any;
  tabStyle?: any;
  activeTabStyle?: any;
  textStyle?: any;
  activeTextStyle?: any;
  onTabChange?: (tabName: string) => void;
}

export default function TabNavigation({
  tabMenus,
  initTab,
  style,
  tabStyle,
  activeTabStyle,
  textStyle,
  activeTextStyle,
  onTabChange
}: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState(initTab || tabMenus[0].name);
  const [indicatorAnimation] = useState(new Animated.Value(0));

  const handleTabPress = (name: string, index: number) => {
    setActiveTab(name);
    onTabChange?.(name);
    
    // Animate indicator
    Animated.spring(indicatorAnimation, {
      toValue: index,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const TabButton = ({ menu, index }: { menu: TabMenu; index: number }) => {
    const isActive = menu.name === activeTab;
    
    return (
      <TouchableOpacity
        onPress={() => handleTabPress(menu.name, index)}
        activeOpacity={0.7}
        style={[
          styles.tabButton,
          tabStyle,
          isActive && styles.activeTabButton,
          isActive && activeTabStyle
        ]}
      >
        <View style={styles.tabContent}>
          {menu.icon && (
            <Text style={[
              styles.tabIcon,
              isActive && styles.activeTabIcon
            ]}>
              {menu.icon}
            </Text>
          )}
          <Text style={[
            styles.tabText,
            textStyle,
            isActive && styles.activeTabText,
            isActive && activeTextStyle
          ]}>
            {menu.name}
          </Text>
          {menu.badge && menu.badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {menu.badge > 99 ? '99+' : menu.badge}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const ActiveScreen = () => {
    const activeMenu = tabMenus.find((menu) => menu.name === activeTab);
    return activeMenu ? activeMenu.component : null;
  };

  const indicatorWidth = 100 / tabMenus.length;
  const translateX = indicatorAnimation.interpolate({
    inputRange: tabMenus.map((_, index) => index),
    outputRange: tabMenus.map((_, index) => index * (100 / tabMenus.length)),
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.navigationContainer}>
        <View style={styles.navigation}>
          {tabMenus.map((menu, index) => (
            <TabButton key={index} menu={menu} index={index} />
          ))}
        </View>
        
        {/* Animated Indicator */}
        <Animated.View
          style={[
            styles.indicator,
            {
              width: `${indicatorWidth}%`,
              transform: [
                {
                  translateX: translateX.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
      
      <View style={styles.content}>
        <ActiveScreen />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  navigationContainer: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navigation: {
    flexDirection: "row",
    backgroundColor: colors.white,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  activeTabButton: {
    // Active tab styling handled by indicator
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#999',
  },
  activeTabIcon: {
    color: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -12,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
});