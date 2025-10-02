import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

export default memo(function Screen({ children }) {
  return <View style={styles.container}>{children}</View>;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});