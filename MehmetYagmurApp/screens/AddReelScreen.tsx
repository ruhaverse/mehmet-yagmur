import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AddReelScreen() {
  const [capturing, setCapturing] = useState(false);

  const handleCapture = () => {
    setCapturing(!capturing);
  };

  return (
    <View style={styles.container}>
      <Text>Add Reel Screen</Text>
      <TouchableOpacity style={styles.button} onPress={handleCapture}>
        <Text style={styles.buttonText}>{capturing ? 'Stop' : 'Start'} Recording</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});