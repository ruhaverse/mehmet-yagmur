import React from 'react';
import {View, Text} from 'react-native';

export default function Icon({
  name,
  size = 40,
  backgroundColor = '#fff',
  color = '#000',
  style,
  noBackground = false,
}) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: noBackground ? null : backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}>
      <Text style={{fontSize: size * 0.5, color}}>{name}</Text>
    </View>
  );
}
