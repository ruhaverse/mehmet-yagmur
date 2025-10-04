import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../config/colors.js';

export default function HeaderWithBackArrow({ title }: { title: string }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.primary,
  },
  backArrow: {
    fontSize: 20,
    color: colors.white,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
  },
});