import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import colors from '../../config/colors';

interface HeaderWithBackArrowProps {
  onBackButton?: () => void;
  title?: string;
  component?: React.ReactNode;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  titleStyle?: any;
}

export default function HeaderWithBackArrow({
  onBackButton,
  title,
  component,
  leftComponent,
  rightComponent,
  titleStyle,
}: HeaderWithBackArrowProps) {
  return (
    <View style={styles.container}>
      {leftComponent ? (
        leftComponent
      ) : (
        <TouchableOpacity onPress={onBackButton} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.centerContainer}>
        {component ? component : (
          <Text style={[styles.title, titleStyle]}>{title}</Text>
        )}
      </View>
      
      {rightComponent && (
        <View style={styles.rightComponent}>
          {rightComponent}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backArrow: {
    fontSize: 24,
    color: colors.text,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  rightComponent: {
    marginLeft: 8,
  },
});