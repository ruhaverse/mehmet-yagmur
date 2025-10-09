import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FeelingAndActivityScreenProps {
  navigation: any;
}

export default function FeelingAndActivityScreen({ navigation }: FeelingAndActivityScreenProps) {
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  
  const feelings = [
    { id: 'happy', emoji: '😊', text: 'Happy' },
    { id: 'excited', emoji: '🤩', text: 'Excited' },
    { id: 'grateful', emoji: '🙏', text: 'Grateful' },
    { id: 'relaxed', emoji: '😌', text: 'Relaxed' },
    { id: 'loved', emoji: '🥰', text: 'Loved' },
    { id: 'blessed', emoji: '✨', text: 'Blessed' },
  ];

  const activities = [
    { id: 'eating', emoji: '🍽️', text: 'Eating' },
    { id: 'traveling', emoji: '✈️', text: 'Traveling' },
    { id: 'working_out', emoji: '💪', text: 'Working out' },
    { id: 'reading', emoji: '📚', text: 'Reading' },
    { id: 'cooking', emoji: '👨‍🍳', text: 'Cooking' },
    { id: 'shopping', emoji: '🛍️', text: 'Shopping' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>How are you feeling?</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.doneButton}>Done</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Feeling</Text>
        <View style={styles.optionsGrid}>
          {feelings.map(feeling => (
            <TouchableOpacity 
              key={feeling.id}
              style={[
                styles.optionItem,
                selectedFeeling === feeling.id && styles.selectedOption
              ]}
              onPress={() => setSelectedFeeling(feeling.id)}
            >
              <Text style={styles.emoji}>{feeling.emoji}</Text>
              <Text style={styles.optionText}>{feeling.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Activity</Text>
        <View style={styles.optionsGrid}>
          {activities.map(activity => (
            <TouchableOpacity 
              key={activity.id}
              style={[
                styles.optionItem,
                selectedActivity === activity.id && styles.selectedOption
              ]}
              onPress={() => setSelectedActivity(activity.id)}
            >
              <Text style={styles.emoji}>{activity.emoji}</Text>
              <Text style={styles.optionText}>{activity.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  doneButton: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    marginTop: 24,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionItem: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  selectedOption: {
    borderColor: '#2196f3',
    backgroundColor: '#f3f9ff',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});