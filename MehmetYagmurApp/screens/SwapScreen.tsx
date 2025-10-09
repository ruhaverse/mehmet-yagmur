import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

interface SwapItem {
  id: string;
  name: string;
  image: string;
}

export default function SwapScreen() {
  const [items, setItems] = useState<SwapItem[]>([]);

  useEffect(() => {
    // Fetch items for swapping (mocked for now)
    setItems([
      { id: '1', name: 'Item 1', image: 'https://via.placeholder.com/150' },
      { id: '2', name: 'Item 2', image: 'https://via.placeholder.com/150' },
      { id: '3', name: 'Item 3', image: 'https://via.placeholder.com/150' },
    ]);
  }, []);

  const handleSwap = (itemId: string) => {
    console.log(`Swapping item with ID: ${itemId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Swap Items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.itemName}>{item.name}</Text>
            <TouchableOpacity style={styles.swapButton} onPress={() => handleSwap(item.id)}>
              <Text style={styles.swapButtonText}>Swap</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  itemName: {
    flex: 1,
    fontSize: 18,
  },
  swapButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  swapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});