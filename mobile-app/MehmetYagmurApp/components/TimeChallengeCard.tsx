// Time Challenge Card Component
// Displays and manages time-based challenges between users

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import TimerDisplay from './TimerDisplay';

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
  duration: number; // minutes
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

interface TimeChallengeCardProps {
  challenge: TimeChallenge;
  currentUserId: string;
  onJoinChallenge?: (challengeId: string) => void;
  onLeaveChallenge?: (challengeId: string) => void;
  onStartChallenge?: (challengeId: string) => void;
  onViewDetails?: (challengeId: string) => void;
}

const TimeChallengeCard: React.FC<TimeChallengeCardProps> = ({
  challenge,
  currentUserId,
  onJoinChallenge,
  onLeaveChallenge,
  onStartChallenge,
  onViewDetails,
}) => {
  const [isJoining, setIsJoining] = useState(false);

  const isParticipant = challenge.participants.some(p => p.id === currentUserId);
  const isCreator = challenge.creator.id === currentUserId;
  const canJoin = !isParticipant && challenge.participants.length < challenge.maxParticipants && challenge.status === 'waiting';
  const canStart = isCreator && challenge.status === 'waiting' && challenge.participants.length > 0;

  const getCategoryIcon = () => {
    switch (challenge.category) {
      case 'fitness': return '🏃‍♂️';
      case 'study': return '📚';
      case 'work': return '💼';
      case 'hobby': return '🎨';
      case 'social': return '👥';
      default: return '⏰';
    }
  };

  const getCategoryColor = () => {
    switch (challenge.category) {
      case 'fitness': return '#4CAF50';
      case 'study': return '#2196F3';
      case 'work': return '#FF9800';
      case 'hobby': return '#9C27B0';
      case 'social': return '#E91E63';
      default: return '#607D8B';
    }
  };

  const getStatusColor = () => {
    switch (challenge.status) {
      case 'waiting': return '#FF9800';
      case 'active': return '#4CAF50';
      case 'completed': return '#607D8B';
      default: return '#9E9E9E';
    }
  };

  const handleJoinChallenge = async () => {
    if (isJoining) return;
    
    setIsJoining(true);
    try {
      await onJoinChallenge?.(challenge.id);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveChallenge = () => {
    Alert.alert(
      'Challenge\'dan Ayrıl',
      'Bu challenge\'dan ayrılmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Ayrıl', 
          style: 'destructive', 
          onPress: () => onLeaveChallenge?.(challenge.id) 
        }
      ]
    );
  };

  const handleStartChallenge = () => {
    Alert.alert(
      'Challenge\'ı Başlat',
      'Tüm katılımcılar için challenge başlatılsın mı?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Başlat', 
          onPress: () => onStartChallenge?.(challenge.id) 
        }
      ]
    );
  };

  const renderParticipants = () => {
    const displayCount = Math.min(challenge.participants.length, 3);
    const extraCount = challenge.participants.length - displayCount;

    return (
      <View style={styles.participantsContainer}>
        <Text style={styles.participantsLabel}>Katılımcılar:</Text>
        <View style={styles.participantAvatars}>
          {challenge.participants.slice(0, displayCount).map((participant, index) => (
            <View key={participant.id} style={[styles.avatarContainer, { zIndex: displayCount - index }]}>
              <Image 
                source={{ uri: participant.avatar }} 
                style={styles.participantAvatar}
              />
              {participant.status === 'completed' && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>✓</Text>
                </View>
              )}
            </View>
          ))}
          {extraCount > 0 && (
            <View style={[styles.avatarContainer, styles.extraCountContainer]}>
              <Text style={styles.extraCountText}>+{extraCount}</Text>
            </View>
          )}
        </View>
        <Text style={styles.participantCount}>
          {challenge.participants.length}/{challenge.maxParticipants}
        </Text>
      </View>
    );
  };

  const renderActionButton = () => {
    if (challenge.status === 'completed') {
      return (
        <TouchableOpacity 
          style={[styles.actionButton, styles.viewResultsButton]}
          onPress={() => onViewDetails?.(challenge.id)}
        >
          <Text style={styles.viewResultsButtonText}>Sonuçları Gör</Text>
        </TouchableOpacity>
      );
    }

    if (challenge.status === 'active') {
      if (isParticipant) {
        const userParticipant = challenge.participants.find(p => p.id === currentUserId);
        return (
          <View style={styles.activeStatus}>
            <TimerDisplay
              startTime={challenge.startTime}
              endTime={challenge.endTime}
              status={userParticipant?.status === 'completed' ? 'completed' : 'active'}
              size="small"
              showProgress={true}
            />
          </View>
        );
      } else {
        return (
          <TouchableOpacity 
            style={[styles.actionButton, styles.watchButton]}
            onPress={() => onViewDetails?.(challenge.id)}
          >
            <Text style={styles.watchButtonText}>İzle</Text>
          </TouchableOpacity>
        );
      }
    }

    if (challenge.status === 'waiting') {
      if (canStart) {
        return (
          <TouchableOpacity 
            style={[styles.actionButton, styles.startButton]}
            onPress={handleStartChallenge}
          >
            <Text style={styles.startButtonText}>Başlat</Text>
          </TouchableOpacity>
        );
      }

      if (canJoin) {
        return (
          <TouchableOpacity 
            style={[styles.actionButton, styles.joinButton]}
            onPress={handleJoinChallenge}
            disabled={isJoining}
          >
            <Text style={styles.joinButtonText}>
              {isJoining ? 'Katılıyor...' : 'Katıl'}
            </Text>
          </TouchableOpacity>
        );
      }

      if (isParticipant) {
        return (
          <TouchableOpacity 
            style={[styles.actionButton, styles.leaveButton]}
            onPress={handleLeaveChallenge}
          >
            <Text style={styles.leaveButtonText}>Ayrıl</Text>
          </TouchableOpacity>
        );
      }

      return (
        <View style={[styles.actionButton, styles.fullButton]}>
          <Text style={styles.fullButtonText}>Dolu</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, { borderLeftColor: getCategoryColor() }]}>
      <View style={styles.header}>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryIcon}>{getCategoryIcon()}</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{challenge.title}</Text>
            <Text style={styles.duration}>{challenge.duration} dakika</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>
            {challenge.status === 'waiting' ? 'Bekliyor' : 
             challenge.status === 'active' ? 'Aktif' : 'Tamamlandı'}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{challenge.description}</Text>

      {renderParticipants()}

      {challenge.rewards && (
        <View style={styles.rewardsContainer}>
          <Text style={styles.rewardsText}>
            🏆 {challenge.rewards.points} puan
            {challenge.rewards.badge && ` • ${challenge.rewards.badge}`}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.creatorInfo}>
          <Image source={{ uri: challenge.creator.avatar }} style={styles.creatorAvatar} />
          <Text style={styles.creatorName}>{challenge.creator.name}</Text>
        </View>
        {renderActionButton()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  duration: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantsLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  participantAvatars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  avatarContainer: {
    marginRight: -8,
    position: 'relative',
  },
  participantAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  completedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadgeText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  extraCountContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  extraCountText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  participantCount: {
    fontSize: 12,
    color: '#666',
  },
  rewardsContainer: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  rewardsText: {
    fontSize: 12,
    color: '#E65100',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  creatorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  creatorName: {
    fontSize: 12,
    color: '#666',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#2196F3',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  leaveButton: {
    backgroundColor: '#F44336',
  },
  leaveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  watchButton: {
    backgroundColor: '#FF9800',
  },
  watchButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  viewResultsButton: {
    backgroundColor: '#9C27B0',
  },
  viewResultsButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  fullButton: {
    backgroundColor: '#E0E0E0',
  },
  fullButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  activeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TimeChallengeCard;