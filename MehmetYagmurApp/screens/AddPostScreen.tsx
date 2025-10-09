import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import HeaderWithBackArrow from '../components/HeaderWithBackArrow';

export default function AddPostScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const handlePost = async () => {
    if (!postText.trim()) {
      Alert.alert('Hata', 'Lütfen bir içerik girin');
      return;
    }

    try {
      // Post verilerini Redux store'a gönder
      const postData = {
        text: postText,
        image: selectedImage,
        timestamp: new Date().toISOString(),
        userId: 'current_user_id', // Auth'dan gelecek
      };

      // API çağrısı yapılacak
      console.log('Post oluşturuluyor:', postData);
      
      Alert.alert('Başarılı', 'Gönderiniz paylaşıldı!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Gönderi paylaşılamadı');
    }
  };

  const selectImage = () => {
    // Fotoğraf seçme işlemi
    Alert.alert('Fotoğraf', 'Fotoğraf seçme özelliği yakında!');
  };

  return (
    <View style={styles.container}>
      <HeaderWithBackArrow title="Yeni Gönderi" onBackPress={() => navigation.goBack()} />
      
      <ScrollView style={styles.content}>
        <TextInput
          style={styles.textInput}
          placeholder="Ne paylaşmak istiyorsun?"
          placeholderTextColor="#999"
          multiline
          value={postText}
          onChangeText={setPostText}
          maxLength={500}
        />

        <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
          <Text style={styles.imageButtonText}>📷 Fotoğraf Ekle</Text>
        </TouchableOpacity>

        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        )}

        <View style={styles.footer}>
          <Text style={styles.characterCount}>{postText.length}/500</Text>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.postButton, !postText.trim() && styles.postButtonDisabled]} 
        onPress={handlePost}
        disabled={!postText.trim()}
      >
        <Text style={styles.postButtonText}>Paylaş</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    marginBottom: 15,
  },
  imageButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  footer: {
    alignItems: 'flex-end',
  },
  characterCount: {
    color: '#999',
    fontSize: 12,
  },
  postButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#ccc',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});