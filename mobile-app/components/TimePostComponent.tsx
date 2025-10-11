import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ShareUpTimeColors } from '../theme/ShareUpTimeTheme';

interface TimePostProps {
  onTimePostCreate?: (post: TimePost) => void;
}

interface TimePost {
  id: string;
  content: string;
  duration: number; // dakika cinsinden
  startTime: Date;
  endTime: Date;
  status: 'active' | 'completed' | 'expired';
  category: 'work' | 'exercise' | 'study' | 'hobby' | 'social';
}

export default function TimePostComponent({ onTimePostCreate }: TimePostProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [content, setContent] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(30); // Default 30 dakika
  const [selectedCategory, setSelectedCategory] = useState<TimePost['category']>('work');

  const durations = [15, 30, 45, 60, 90, 120]; // Dakika seçenekleri
  
  const categories = [
    { key: 'work', label: 'İş', icon: 'work', color: ShareUpTimeColors.primary },
    { key: 'exercise', label: 'Egzersiz', icon: 'fitness-center', color: ShareUpTimeColors.timeActive },
    { key: 'study', label: 'Çalışma', icon: 'school', color: ShareUpTimeColors.accent },
    { key: 'hobby', label: 'Hobi', icon: 'palette', color: ShareUpTimeColors.secondary },
    { key: 'social', label: 'Sosyal', icon: 'people', color: ShareUpTimeColors.like },
  ];

  const createTimePost = () => {
    if (!content.trim()) {
      Alert.alert('Hata', 'Lütfen bir içerik girin!');
      return;
    }

    const now = new Date();
    const endTime = new Date(now.getTime() + selectedDuration * 60000);

    const timePost: TimePost = {
      id: Date.now().toString(),
      content: content.trim(),
      duration: selectedDuration,
      startTime: now,
      endTime: endTime,
      status: 'active',
      category: selectedCategory,
    };

    onTimePostCreate?.(timePost);
    
    // Reset form
    setContent('');
    setSelectedDuration(30);
    setSelectedCategory('work');
    setIsModalVisible(false);

    Alert.alert(
      '⏰ Zaman Postu Oluşturuldu!', 
      `${selectedDuration} dakikalık "${content}" aktivitesi başlatıldı!`
    );
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}dk`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}s ${remainingMinutes}dk` : `${hours}s`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <Icon name="access-time" size={24} color={ShareUpTimeColors.white} />
        <Text style={styles.createButtonText}>Zaman Postu Oluştur</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Icon name="close" size={24} color={ShareUpTimeColors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Zaman Postu Oluştur</Text>
            <TouchableOpacity onPress={createTimePost}>
              <Text style={styles.createText}>Oluştur</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Content Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ne yapıyorsun?</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Örn: Proje üzerinde çalışıyorum"
                value={content}
                onChangeText={setContent}
                multiline
                maxLength={200}
              />
            </View>

            {/* Duration Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Süre Seç</Text>
              <View style={styles.durationContainer}>
                {durations.map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.durationButton,
                      selectedDuration === duration && styles.selectedDuration
                    ]}
                    onPress={() => setSelectedDuration(duration)}
                  >
                    <Text style={[
                      styles.durationText,
                      selectedDuration === duration && styles.selectedDurationText
                    ]}>
                      {formatDuration(duration)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kategori Seç</Text>
              <View style={styles.categoryContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.key}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.key && { 
                        backgroundColor: category.color + '20',
                        borderColor: category.color 
                      }
                    ]}
                    onPress={() => setSelectedCategory(category.key as TimePost['category'])}
                  >
                    <Icon 
                      name={category.icon} 
                      size={20} 
                      color={selectedCategory === category.key ? category.color : ShareUpTimeColors.textSecondary} 
                    />
                    <Text style={[
                      styles.categoryText,
                      selectedCategory === category.key && { color: category.color }
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Time Info */}
            <View style={styles.timeInfoContainer}>
              <View style={styles.timeInfo}>
                <Icon name="play-arrow" size={20} color={ShareUpTimeColors.timeActive} />
                <Text style={styles.timeInfoText}>Şimdi başlayacak</Text>
              </View>
              <View style={styles.timeInfo}>
                <Icon name="stop" size={20} color={ShareUpTimeColors.timeExpired} />
                <Text style={styles.timeInfoText}>
                  {new Date(Date.now() + selectedDuration * 60000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })} bitiş
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  createButton: {
    backgroundColor: ShareUpTimeColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonText: {
    color: ShareUpTimeColors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: ShareUpTimeColors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: ShareUpTimeColors.light,
    backgroundColor: ShareUpTimeColors.white,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: ShareUpTimeColors.textPrimary,
  },
  createText: {
    fontSize: 16,
    fontWeight: '600',
    color: ShareUpTimeColors.primary,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ShareUpTimeColors.textPrimary,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: ShareUpTimeColors.white,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: ShareUpTimeColors.light,
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: ShareUpTimeColors.white,
    borderWidth: 1,
    borderColor: ShareUpTimeColors.light,
  },
  selectedDuration: {
    backgroundColor: ShareUpTimeColors.primary,
    borderColor: ShareUpTimeColors.primary,
  },
  durationText: {
    fontSize: 14,
    color: ShareUpTimeColors.textSecondary,
  },
  selectedDurationText: {
    color: ShareUpTimeColors.white,
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: ShareUpTimeColors.white,
    borderWidth: 1,
    borderColor: ShareUpTimeColors.light,
  },
  categoryText: {
    fontSize: 14,
    color: ShareUpTimeColors.textSecondary,
    marginLeft: 8,
  },
  timeInfoContainer: {
    backgroundColor: ShareUpTimeColors.white,
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInfoText: {
    fontSize: 14,
    color: ShareUpTimeColors.textSecondary,
    marginLeft: 8,
  },
});