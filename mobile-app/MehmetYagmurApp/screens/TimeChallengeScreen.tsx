// Time Challenge Screen
// Main screen for managing and participating in time challenges

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import TimeChallengeCard from '../components/TimeChallengeCard';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  status: 'joined' | 'active' | 'completed' | 'failed';
  completedAt?: Date;
  progress?: number;
}

interface TimeChallenge {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'study' | 'work' | 'hobby' | 'social';
  duration: number;
  maxParticipants: number;
  creator: Participant;
  participants: Participant[];
  startTime: Date;
  endTime: Date;
  status: 'waiting' | 'active' | 'completed';
  rewards?: {
    points: number;
    badge?: string;
  };
}

interface TimeChallengeScreenProps {
  navigation: any;
}

const TimeChallengeScreen: React.FC<TimeChallengeScreenProps> = ({ navigation }) => {
  const [challenges, setChallenges] = useState<TimeChallenge[]>([]);
  const [activeTab, setActiveTab] = useState<'discover' | 'joined' | 'created'>('discover');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock current user ID
  const currentUserId = 'user_1';

  useEffect(() => {
    loadChallenges();
  }, [activeTab]);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      // Mock data - In real app, this would be API calls
      const mockChallenges: TimeChallenge[] = [
        {
          id: '1',
          title: '30 Dakika Odaklanma Challenge',
          description: 'Hiç dikkatinizi dağıtmadan 30 dakika boyunca çalışın. Telefon yasak!',
          category: 'study',
          duration: 30,
          maxParticipants: 10,
          creator: {
            id: 'user_2',
            name: 'Ayşe Yılmaz',
            avatar: 'https://picsum.photos/40/40?random=1',
            status: 'joined',
          },
          participants: [
            {
              id: 'user_2',
              name: 'Ayşe Yılmaz',
              avatar: 'https://picsum.photos/40/40?random=1',
              status: 'joined',
            },
            {
              id: 'user_3',
              name: 'Mehmet Kaya',
              avatar: 'https://picsum.photos/40/40?random=2',
              status: 'joined',
            },
            {
              id: 'user_4',
              name: 'Fatma Demir',
              avatar: 'https://picsum.photos/40/40?random=3',
              status: 'completed',
              completedAt: new Date(),
            },
          ],
          startTime: new Date(Date.now() + 30 * 60000), // 30 minutes from now
          endTime: new Date(Date.now() + 60 * 60000), // 60 minutes from now
          status: 'waiting',
          rewards: {
            points: 100,
            badge: '🎯 Odaklanma Uzmanı',
          },
        },
        {
          id: '2',
          title: 'Sabah Koşusu Challenge',
          description: 'Güne enerjik başlamak için 45 dakikalık sabah koşusu yapalım!',
          category: 'fitness',
          duration: 45,
          maxParticipants: 8,
          creator: {
            id: 'user_1',
            name: 'Ben',
            avatar: 'https://picsum.photos/40/40?random=5',
            status: 'joined',
          },
          participants: [
            {
              id: 'user_1',
              name: 'Ben',
              avatar: 'https://picsum.photos/40/40?random=5',
              status: 'active',
            },
            {
              id: 'user_6',
              name: 'Ali Yıldız',
              avatar: 'https://picsum.photos/40/40?random=6',
              status: 'active',
            },
          ],
          startTime: new Date(Date.now() - 15 * 60000), // Started 15 minutes ago
          endTime: new Date(Date.now() + 30 * 60000), // Ends in 30 minutes
          status: 'active',
          rewards: {
            points: 150,
          },
        },
        {
          id: '3',
          title: 'Kitap Okuma Maratonu',
          description: '2 saat kesintisiz kitap okuma challenge\'ı. Hangi kitabı okuyorsunuz?',
          category: 'hobby',
          duration: 120,
          maxParticipants: 15,
          creator: {
            id: 'user_7',
            name: 'Zeynep Öztürk',
            avatar: 'https://picsum.photos/40/40?random=7',
            status: 'joined',
          },
          participants: [
            {
              id: 'user_7',
              name: 'Zeynep Öztürk',
              avatar: 'https://picsum.photos/40/40?random=7',
              status: 'completed',
            },
            {
              id: 'user_8',
              name: 'Can Arslan',
              avatar: 'https://picsum.photos/40/40?random=8',
              status: 'completed',
            },
            {
              id: 'user_9',
              name: 'Elif Şahin',
              avatar: 'https://picsum.photos/40/40?random=9',
              status: 'failed',
            },
          ],
          startTime: new Date(Date.now() - 150 * 60000), // Started 2.5 hours ago
          endTime: new Date(Date.now() - 30 * 60000), // Ended 30 minutes ago
          status: 'completed',
          rewards: {
            points: 200,
            badge: '📚 Kitap Kurdu',
          },
        },
      ];

      // Filter based on active tab
      let filteredChallenges = mockChallenges;
      if (activeTab === 'joined') {
        filteredChallenges = mockChallenges.filter(c => 
          c.participants.some(p => p.id === currentUserId)
        );
      } else if (activeTab === 'created') {
        filteredChallenges = mockChallenges.filter(c => 
          c.creator.id === currentUserId
        );
      }

      setChallenges(filteredChallenges);
    } catch (error) {
      Alert.alert('Hata', 'Challenge\'lar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadChallenges();
    setRefreshing(false);
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setChallenges(prev => prev.map(challenge => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            participants: [
              ...challenge.participants,
              {
                id: currentUserId,
                name: 'Ben',
                avatar: 'https://picsum.photos/40/40?random=5',
                status: 'joined',
              }
            ]
          };
        }
        return challenge;
      }));

      Alert.alert('Başarılı', 'Challenge\'a katıldınız!');
    } catch (error) {
      Alert.alert('Hata', 'Challenge\'a katılırken bir hata oluştu.');
    }
  };

  const handleLeaveChallenge = async (challengeId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setChallenges(prev => prev.map(challenge => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            participants: challenge.participants.filter(p => p.id !== currentUserId)
          };
        }
        return challenge;
      }));

      Alert.alert('Başarılı', 'Challenge\'dan ayrıldınız.');
    } catch (error) {
      Alert.alert('Hata', 'Challenge\'dan ayrılırken bir hata oluştu.');
    }
  };

  const handleStartChallenge = async (challengeId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setChallenges(prev => prev.map(challenge => {
        if (challenge.id === challengeId) {
          const now = new Date();
          return {
            ...challenge,
            status: 'active' as const,
            startTime: now,
            endTime: new Date(now.getTime() + challenge.duration * 60000),
            participants: challenge.participants.map(p => ({
              ...p,
              status: 'active' as const,
            }))
          };
        }
        return challenge;
      }));

      Alert.alert('Başarılı', 'Challenge başlatıldı!');
    } catch (error) {
      Alert.alert('Hata', 'Challenge başlatılırken bir hata oluştu.');
    }
  };

  const handleViewDetails = (challengeId: string) => {
    navigation.navigate('ChallengeDetail', { challengeId });
  };

  const handleCreateChallenge = () => {
    navigation.navigate('CreateChallenge');
  };

  const renderTabButton = (tab: typeof activeTab, label: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && styles.tabButtonActive
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[
        styles.tabButtonText,
        activeTab === tab && styles.tabButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderChallenge = ({ item }: { item: TimeChallenge }) => (
    <TimeChallengeCard
      challenge={item}
      currentUserId={currentUserId}
      onJoinChallenge={handleJoinChallenge}
      onLeaveChallenge={handleLeaveChallenge}
      onStartChallenge={handleStartChallenge}
      onViewDetails={handleViewDetails}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>
        {activeTab === 'discover' ? '🔍' : activeTab === 'joined' ? '👥' : '📝'}
      </Text>
      <Text style={styles.emptyStateTitle}>
        {activeTab === 'discover' 
          ? 'Henüz Challenge Yok'
          : activeTab === 'joined'
          ? 'Henüz Katıldığınız Challenge Yok'
          : 'Henüz Oluşturduğunuz Challenge Yok'
        }
      </Text>
      <Text style={styles.emptyStateText}>
        {activeTab === 'discover' 
          ? 'İlk challenge\'ı siz oluşturun!'
          : activeTab === 'joined'
          ? 'Keşfet sekmesinden ilginizi çeken challenge\'lara katılın.'
          : 'Arkadaşlarınızla birlikte challenge oluşturun.'
        }
      </Text>
      {(activeTab === 'discover' || activeTab === 'created') && (
        <TouchableOpacity 
          style={styles.createChallengeButton}
          onPress={handleCreateChallenge}
        >
          <Text style={styles.createChallengeButtonText}>Challenge Oluştur</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Time Challenges</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateChallenge}
        >
          <Text style={styles.createButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {renderTabButton('discover', 'Keşfet')}
        {renderTabButton('joined', 'Katıldıklarım')}
        {renderTabButton('created', 'Oluşturduklarım')}
      </View>

      <FlatList
        data={challenges}
        renderItem={renderChallenge}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2196F3']}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  createButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  tabButtonTextActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
  listContainer: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createChallengeButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createChallengeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TimeChallengeScreen;