import React, { ReactNode } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  StatusBar,
  Platform,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  safeArea?: boolean;
  backgroundColor?: string;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  scrollViewProps?: ScrollViewProps;
  preset?: 'scroll' | 'fixed' | 'auto';
}

const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  scrollable = false,
  safeArea = true,
  backgroundColor = '#FFFFFF',
  statusBarStyle = 'dark-content',
  padding,
  paddingHorizontal,
  paddingVertical,
  scrollViewProps,
  preset = 'auto',
}) => {
  const insets = useSafeAreaInsets();

  // Determine if we should use ScrollView
  const shouldScroll = preset === 'scroll' || (preset === 'auto' && scrollable);

  // Base container style
  const containerStyle = [
    styles.container,
    {
      backgroundColor,
      ...(padding && { padding }),
      ...(paddingHorizontal && { paddingHorizontal }),
      ...(paddingVertical && { paddingVertical }),
    },
    style,
  ];

  // Safe area style
  const safeAreaStyle = safeArea
    ? {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }
    : {};

  const content = shouldScroll ? (
    <ScrollView
      style={[styles.scrollView, safeAreaStyle]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fixedView, safeAreaStyle]}>
      {children}
    </View>
  );

  return (
    <View style={containerStyle}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={backgroundColor}
        translucent={Platform.OS === 'android'}
      />
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  fixedView: {
    flex: 1,
  },
});

export default Screen;