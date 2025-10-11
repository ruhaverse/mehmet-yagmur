// Schedule Post Modal Component
// Provides interface for scheduling time-based posts

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface ScheduledPost {
  id: string;
  content: string;
  scheduleType: 'once' | 'daily' | 'weekly' | 'custom';
  scheduledTime: Date;
  duration: number; // minutes
  category: 'work' | 'exercise' | 'study' | 'hobby' | 'social';
  isActive: boolean;
  recurringDays?: number[]; // 0-6, Sunday = 0
  endDate?: Date;
}

interface SchedulePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSchedulePost: (post: Omit<ScheduledPost, 'id'>) => void;
  existingPost?: ScheduledPost;
}

const SchedulePostModal: React.FC<SchedulePostModalProps> = ({
  visible,
  onClose,
  onSchedulePost,
  existingPost,
}) => {
  const [content, setContent] = useState(existingPost?.content || '');
  const [scheduleType, setScheduleType] = useState<ScheduledPost['scheduleType']>(
    existingPost?.scheduleType || 'once'
  );
  const [scheduledTime, setScheduledTime] = useState(
    existingPost?.scheduledTime || new Date()
  );
  const [duration, setDuration] = useState(existingPost?.duration || 30);
  const [category, setCategory] = useState<ScheduledPost['category']>(
    existingPost?.category || 'work'
  );
  const [recurringDays, setRecurringDays] = useState<number[]>(
    existingPost?.recurringDays || []
  );
  const [endDate, setEndDate] = useState<Date | undefined>(existingPost?.endDate);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const durations = [15, 30, 45, 60, 90, 120, 180, 240];
  const categories = [
    { key: 'work', label: 'İş', icon: '💼', color: '#FF9800' },
    { key: 'exercise', label: 'Egzersiz', icon: '🏃‍♂️', color: '#4CAF50' },
    { key: 'study', label: 'Çalışma', icon: '📚', color: '#2196F3' },
    { key: 'hobby', label: 'Hobi', icon: '🎨', color: '#9C27B0' },
    { key: 'social', label: 'Sosyal', icon: '👥', color: '#E91E63' },
  ];

  const scheduleTypes = [
    { key: 'once', label: 'Tek Sefer', description: 'Sadece bir kez' },
    { key: 'daily', label: 'Günlük', description: 'Her gün aynı saatte' },
    { key: 'weekly', label: 'Haftalık', description: 'Her hafta aynı gün' },
    { key: 'custom', label: 'Özel', description: 'Seçilen günlerde' },
  ];

  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Hata', 'Lütfen bir içerik girin.');
      return;
    }

    if (scheduledTime <= new Date()) {
      Alert.alert('Hata', 'Zamanlanmış saat gelecekte bir zaman olmalıdır.');
      return;
    }

    if (scheduleType === 'custom' && recurringDays.length === 0) {
      Alert.alert('Hata', 'Lütfen en az bir gün seçin.');
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduledPost: Omit<ScheduledPost, 'id'> = {
        content: content.trim(),
        scheduleType,
        scheduledTime,
        duration,
        category,
        isActive: true,
        ...(scheduleType !== 'once' && { recurringDays }),
        ...(endDate && { endDate }),
      };

      await onSchedulePost(scheduledPost);
      handleClose();
    } catch (error) {
      Alert.alert('Hata', 'Post zamanlanamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setScheduleType('once');
    setScheduledTime(new Date());
    setDuration(30);
    setCategory('work');
    setRecurringDays([]);
    setEndDate(undefined);
    onClose();
  };

  const toggleRecurringDay = (day: number) => {
    setRecurringDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    );
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDateTime = new Date(scheduledTime);
      newDateTime.setFullYear(selectedDate.getFullYear());
      newDateTime.setMonth(selectedDate.getMonth());
      newDateTime.setDate(selectedDate.getDate());
      setScheduledTime(newDateTime);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDateTime = new Date(scheduledTime);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setScheduledTime(newDateTime);
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelText}>İptal</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Post Zamanla</Text>
          <TouchableOpacity 
            onPress={handleSubmit} 
            disabled={isSubmitting}
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          >
            <Text style={[styles.submitText, isSubmitting && styles.submitTextDisabled]}>
              {isSubmitting ? 'Zamanlanıyor...' : 'Zamanla'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Content Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İçerik</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Ne yapmayı planlıyorsunuz?"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Schedule Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zamanlama Türü</Text>
            <View style={styles.scheduleTypeContainer}>
              {scheduleTypes.map(type => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.scheduleTypeButton,
                    scheduleType === type.key && styles.scheduleTypeButtonSelected
                  ]}
                  onPress={() => setScheduleType(type.key as ScheduledPost['scheduleType'])}
                >
                  <Text style={[
                    styles.scheduleTypeLabel,
                    scheduleType === type.key && styles.scheduleTypeLabelSelected
                  ]}>
                    {type.label}
                  </Text>
                  <Text style={[
                    styles.scheduleTypeDescription,
                    scheduleType === type.key && styles.scheduleTypeDescriptionSelected
                  ]}>
                    {type.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date and Time Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tarih ve Saat</Text>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeLabel}>Tarih</Text>
                <Text style={styles.dateTimeValue}>
                  {scheduledTime.toLocaleDateString('tr-TR')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeLabel}>Saat</Text>
                <Text style={styles.dateTimeValue}>
                  {scheduledTime.toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recurring Days (for custom schedule) */}
          {scheduleType === 'custom' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tekrar Günleri</Text>
              <View style={styles.daysContainer}>
                {dayNames.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayButton,
                      recurringDays.includes(index) && styles.dayButtonSelected
                    ]}
                    onPress={() => toggleRecurringDay(index)}
                  >
                    <Text style={[
                      styles.dayText,
                      recurringDays.includes(index) && styles.dayTextSelected
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* End Date (for recurring schedules) */}
          {scheduleType !== 'once' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bitiş Tarihi (İsteğe Bağlı)</Text>
              <TouchableOpacity 
                style={styles.endDateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.endDateText}>
                  {endDate ? endDate.toLocaleDateString('tr-TR') : 'Bitiş tarihi seç'}
                </Text>
              </TouchableOpacity>
              {endDate && (
                <TouchableOpacity 
                  style={styles.clearEndDateButton}
                  onPress={() => setEndDate(undefined)}
                >
                  <Text style={styles.clearEndDateText}>Temizle</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Duration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Süre</Text>
            <View style={styles.durationContainer}>
              {durations.map(dur => (
                <TouchableOpacity
                  key={dur}
                  style={[
                    styles.durationButton,
                    duration === dur && styles.durationButtonSelected
                  ]}
                  onPress={() => setDuration(dur)}
                >
                  <Text style={[
                    styles.durationText,
                    duration === dur && styles.durationTextSelected
                  ]}>
                    {dur} dk
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kategori</Text>
            <View style={styles.categoryContainer}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryButton,
                    category === cat.key && styles.categoryButtonSelected,
                    { borderColor: cat.color }
                  ]}
                  onPress={() => setCategory(cat.key as ScheduledPost['category'])}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={[
                    styles.categoryText,
                    category === cat.key && styles.categoryTextSelected
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Date/Time Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={scheduledTime}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={scheduledTime}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={onEndDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2196F3',
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  submitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  submitTextDisabled: {
    color: '#999',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  contentInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  scheduleTypeContainer: {
    gap: 8,
  },
  scheduleTypeButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  scheduleTypeButtonSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  scheduleTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  scheduleTypeLabelSelected: {
    color: '#2196F3',
  },
  scheduleTypeDescription: {
    fontSize: 12,
    color: '#666',
  },
  scheduleTypeDescriptionSelected: {
    color: '#1976D2',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  dateTimeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
  endDateButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  endDateText: {
    fontSize: 16,
    color: '#333',
  },
  clearEndDateButton: {
    marginTop: 8,
    alignSelf: 'center',
  },
  clearEndDateText: {
    fontSize: 14,
    color: '#F44336',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  durationButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  durationText: {
    fontSize: 14,
    color: '#666',
  },
  durationTextSelected: {
    color: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  categoryButtonSelected: {
    backgroundColor: '#F5F5F5',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextSelected: {
    fontWeight: '600',
    color: '#333',
  },
});

export default SchedulePostModal;