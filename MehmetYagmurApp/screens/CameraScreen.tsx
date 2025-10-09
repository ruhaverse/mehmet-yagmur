import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';

export default function CameraScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImagePicker = () => {
    Alert.alert(
      'Fotoğraf Seç',
      'Nereden fotoğraf seçmek istiyorsunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Kameradan Çek', onPress: openCamera },
        { text: 'Galeriden Seç', onPress: openGallery },
      ]
    );
  };

  const openCamera = () => {
    Alert.alert('Kamera', 'Kamera özelliği yakında eklenecek!');
  };

  const openGallery = () => {
    Alert.alert('Galeri', 'Galeri özelliği yakında eklenecek!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Kamera & Galeri</Text>
        <Text style={styles.subtitle}>
          Fotoğraf çekebilir veya galeriden seçebilirsiniz
        </Text>
        
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity 
              style={styles.changeButton} 
              onPress={openImagePicker}
            >
              <Text style={styles.changeButtonText}>Değiştir</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.selectButton} onPress={openImagePicker}>
            <Text style={styles.selectButtonText}>📷 Fotoğraf Seç</Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            📱 Platform: {Platform.OS}
          </Text>
          <Text style={styles.infoText}>
            📸 Kamera desteği: {Platform.OS === 'ios' || Platform.OS === 'android' ? 'Var' : 'Web'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  selectButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 30,
  },
  selectButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  changeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  changeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
});