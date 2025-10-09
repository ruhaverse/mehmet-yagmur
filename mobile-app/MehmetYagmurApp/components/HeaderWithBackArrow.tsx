import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface HeaderWithBackArrowProps {
  title?: string;
  onBackPress?: () => void;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  titleColor?: string;
  titleStyle?: TextStyle;
  style?: ViewStyle;
  showBackButton?: boolean;
  backIconName?: string;
  backIconColor?: string;
  elevation?: number;
}

const HeaderWithBackArrow: React.FC<HeaderWithBackArrowProps> = ({
  title = '',
  onBackPress,
  leftComponent,
  rightComponent,
  backgroundColor = '#FFFFFF',
  titleColor = '#000000',
  titleStyle,
  style,
  showBackButton = true,
  backIconName = 'arrow-back',
  backIconColor = '#000000',
  elevation = 4,
}) => {
  const insets = useSafeAreaInsets();

  const headerStyle = [
    styles.container,
    {
      backgroundColor,
      paddingTop: insets.top + 10,
      elevation: Platform.OS === 'android' ? elevation : 0,
      shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
    },
    style,
  ];

  const textStyle = [
    styles.title,
    { color: titleColor },
    titleStyle,
  ];

  return (
    <View style={headerStyle}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundColor}
        translucent
      />
      <View style={styles.content}>
        {/* Left Side */}
        <View style={styles.leftContainer}>
          {leftComponent || (
            showBackButton && onBackPress && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBackPress}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon
                  name={backIconName}
                  size={24}
                  color={backIconColor}
                />
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Center Title */}
        <View style={styles.centerContainer}>
          {title ? (
            <Text style={textStyle} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
        </View>

        {/* Right Side */}
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    minHeight: 44,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default HeaderWithBackArrow;