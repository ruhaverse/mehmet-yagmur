import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SentRequest {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  fullName: string;
  mutualFriends: number;
  isVerified?: boolean;
  sentAt: string;
  status: 'pending' | 'accepted' | 'declined';
  location?: string;
}

export default function SentRequestsScreen({ navigation }: any) {
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState<SentRequest[]>([
    {
      id: 'sr1',
      userId: 'u1',
      userName: 'alice_wonder',
      userImage: 'https://picsum.photos/60/60?random=1',
      fullName: 'Alice Wonderland',
      mutualFriends: 12,
      isVerified: true,
      sentAt: '2 days ago',
      status: 'pending',
      location: 'New York, NY'
    },
    {
      id: 'sr2',
      userId: 'u2',
      userName: 'bob_builder',
      userImage: 'https://picsum.photos/60/60?random=2',
      fullName: 'Bob The Builder',
      mutualFriends: 5,
      isVerified: false,
      sentAt: '1 week ago',
      status: 'pending',
      location: 'San Francisco, CA'
    },
    {
      id: 'sr3',
      userId: 'u3',
      userName: 'carol_singer',
      userImage: 'https://picsum.photos/60/60?random=3',
      fullName: 'Carol Singer',
      mutualFriends: 8,
      isVerified: true,
      sentAt: '3 days ago',
      status: 'accepted',
      location: 'Los Angeles, CA'
    },
    {
      id: 'sr4',
      userId: 'u4',
      userName: 'david_photographer',
      userImage: 'https://picsum.photos/60/60?random=4',
      fullName: 'David Lens',
      mutualFriends: 3,
      isVerified: false,
      sentAt: '5 days ago',
      status: 'declined',
      location: 'Miami, FL'
    },
    {
      id: 'sr5',
      userId: 'u5',
      userName: 'emma_artist',
      userImage: 'https://picsum.photos/60/60?random=5',
      fullName: 'Emma Artist',
      mutualFriends: 15,
      isVerified: true,
      sentAt: '1 day ago',
      status: 'pending',
      location: 'Chicago, IL'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const handleCancelRequest = (requestId: string) => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this friend request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setRequests(prev => prev.filter(req => req.id !== requestId));
          }
        }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'accepted':
        return '#4caf50';
      case 'declined':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sent Requests</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'accepted', label: 'Accepted' },
            { key: 'declined', label: 'Declined' }
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.filterTab,
                filter === tab.key && styles.activeFilterTab
              ]}
              onPress={() => setFilter(tab.key as any)}
            >
              <Text style={[
                styles.filterTabText,
                filter === tab.key && styles.activeFilterTabText
              ]}>
                {tab.label}
              </Text>
              {tab.key !== 'all' && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>
                    {requests.filter(req => req.status === tab.key).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Requests List */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📤</Text>
            <Text style={styles.emptyTitle}>No Sent Requests</Text>
            <Text style={styles.emptyMessage}>
              {filter === 'all' 
                ? "You haven't sent any friend requests yet"
                : `No ${filter} requests found`
              }
            </Text>
          </View>
        ) : (
          filteredRequests.map((request) => (
            <View key={request.id} style={styles.requestItem}>
              {/* User Info */}
              <TouchableOpacity
                style={styles.userSection}
                onPress={() => navigation.navigate('Profile', { userId: request.userId })}
              >
                <Image
                  source={{ uri: request.userImage }}
                  style={styles.userImage}
                />
                <View style={styles.userDetails}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.userName}>{request.fullName}</Text>
                    {request.isVerified && (
                      <Text style={styles.verifiedIcon}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.userHandle}>@{request.userName}</Text>
                  {request.location && (
                    <Text style={styles.userLocation}>📍 {request.location}</Text>
                  )}
                  <Text style={styles.mutualFriends}>
                    {request.mutualFriends} mutual friends
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Status and Actions */}
              <View style={styles.actionSection}>
                <View style={styles.statusInfo}>
                  <Text 
                    style={[
                      styles.statusText,
                      { color: getStatusColor(request.status) }
                    ]}
                  >
                    {getStatusText(request.status)}
                  </Text>
                  <Text style={styles.sentTime}>Sent {request.sentAt}</Text>
                </View>

                {request.status === 'pending' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => handleCancelRequest(request.id)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {request.status === 'accepted' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.messageButton}
                      onPress={() => navigation.navigate('Chat', { userId: request.userId })}
                    >
                      <Text style={styles.messageButtonText}>Message</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {request.status === 'declined' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.resendButton}
                      onPress={() => {
                        // Simulate resending request
                        setRequests(prev => 
                          prev.map(req => 
                            req.id === request.id 
                              ? { ...req, status: 'pending', sentAt: 'now' }
                              : req
                          )
                        );
                      }}
                    >
                      <Text style={styles.resendButtonText}>Resend</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {requests.filter(req => req.status === 'pending').length} pending • {' '}
          {requests.filter(req => req.status === 'accepted').length} accepted • {' '}
          {requests.filter(req => req.status === 'declined').length} declined
        </Text>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  filterContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  activeFilterTab: {
    backgroundColor: '#2196f3',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterTabText: {
    color: '#ffffff',
  },
  filterBadge: {
    backgroundColor: '#ff5722',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
  },
  requestItem: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  userSection: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  verifiedIcon: {
    fontSize: 14,
    color: '#2196f3',
    marginLeft: 4,
  },
  userHandle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  mutualFriends: {
    fontSize: 12,
    color: '#666',
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  sentTime: {
    fontSize: 12,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  messageButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  resendButton: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  resendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});