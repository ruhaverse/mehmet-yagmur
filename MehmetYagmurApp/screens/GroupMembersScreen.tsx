import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GroupMember {
  id: string;
  name: string;
  username: string;
  image: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  isOnline: boolean;
  lastSeen?: string;
  postsCount: number;
  contributionScore: number;
  badges: string[];
  bio?: string;
  location?: string;
  isBlocked: boolean;
  isMuted: boolean;
}

interface PendingRequest {
  id: string;
  userId: string;
  name: string;
  username: string;
  image: string;
  requestedAt: string;
  mutualFriends: number;
  bio?: string;
}

export default function GroupMembersScreen({ route, navigation }: any) {
  const { groupId } = route.params;
  
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'members' | 'admins' | 'pending'>('members');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteUsername, setInviteUsername] = useState('');

  // Current user info
  const currentUser = { id: 'me', role: 'admin' } as const; // For demo, assume current user is admin
  const isAdmin = currentUser.role === 'admin';
  const isModerator = currentUser.role === 'admin' || currentUser.role === 'moderator';

  // Mock data
  useEffect(() => {
    setMembers([
      {
        id: 'member1',
        name: 'John Smith',
        username: 'john_admin',
        image: 'https://picsum.photos/60/60?random=1',
        role: 'admin',
        joinedAt: '2023-06-15',
        isOnline: true,
        postsCount: 145,
        contributionScore: 98,
        badges: ['👑', '🏆', '⭐'],
        bio: 'React Native expert and group founder. Always happy to help!',
        location: 'San Francisco, CA',
        isBlocked: false,
        isMuted: false,
      },
      {
        id: 'member2',
        name: 'Alice Johnson',
        username: 'alice_dev',
        image: 'https://picsum.photos/60/60?random=2',
        role: 'moderator',
        joinedAt: '2023-07-20',
        isOnline: false,
        lastSeen: '2 hours ago',
        postsCount: 89,
        contributionScore: 87,
        badges: ['⭐', '💡'],
        bio: 'Senior mobile developer specializing in React Native and Flutter.',
        location: 'New York, NY',
        isBlocked: false,
        isMuted: false,
      },
      {
        id: 'member3',
        name: 'Bob Wilson',
        username: 'bob_designer',
        image: 'https://picsum.photos/60/60?random=3',
        role: 'member',
        joinedAt: '2023-08-10',
        isOnline: true,
        postsCount: 67,
        contributionScore: 75,
        badges: ['🎨', '💡'],
        bio: 'UI/UX designer passionate about mobile app design and user experience.',
        location: 'Los Angeles, CA',
        isBlocked: false,
        isMuted: false,
      },
      {
        id: 'member4',
        name: 'Carol Davis',
        username: 'carol_pm',
        image: 'https://picsum.photos/60/60?random=4',
        role: 'member',
        joinedAt: '2023-09-05',
        isOnline: false,
        lastSeen: '1 day ago',
        postsCount: 34,
        contributionScore: 62,
        badges: ['📊'],
        bio: 'Project manager with experience in mobile app development lifecycle.',
        location: 'Austin, TX',
        isBlocked: false,
        isMuted: false,
      },
      {
        id: 'member5',
        name: 'David Brown',
        username: 'david_qa',
        image: 'https://picsum.photos/60/60?random=5',
        role: 'member',
        joinedAt: '2023-09-22',
        isOnline: true,
        postsCount: 28,
        contributionScore: 58,
        badges: ['🔍'],
        bio: 'Quality assurance engineer focused on mobile app testing and automation.',
        location: 'Seattle, WA',
        isBlocked: false,
        isMuted: false,
      },
      {
        id: 'member6',
        name: 'Emma Wilson',
        username: 'emma_junior',
        image: 'https://picsum.photos/60/60?random=6',
        role: 'member',
        joinedAt: '2024-01-10',
        isOnline: false,
        lastSeen: '3 hours ago',
        postsCount: 12,
        contributionScore: 42,
        badges: ['🌟'],
        bio: 'Junior developer learning React Native. Excited to contribute and learn!',
        location: 'Miami, FL',
        isBlocked: false,
        isMuted: false,
      },
      {
        id: 'member7',
        name: 'Frank Miller',
        username: 'frank_spammer',
        image: 'https://picsum.photos/60/60?random=7',
        role: 'member',
        joinedAt: '2024-01-15',
        isOnline: false,
        lastSeen: '2 weeks ago',
        postsCount: 3,
        contributionScore: 15,
        badges: [],
        bio: 'Marketing professional interested in mobile app promotion strategies.',
        location: 'Chicago, IL',
        isBlocked: true,
        isMuted: true,
      },
    ]);

    setPendingRequests([
      {
        id: 'req1',
        userId: 'user_pending1',
        name: 'Grace Chen',
        username: 'grace_flutter',
        image: 'https://picsum.photos/60/60?random=101',
        requestedAt: '2 hours ago',
        mutualFriends: 5,
        bio: 'Flutter developer interested in learning React Native.',
      },
      {
        id: 'req2',
        userId: 'user_pending2',
        name: 'Henry Lopez',
        username: 'henry_backend',
        image: 'https://picsum.photos/60/60?random=102',
        requestedAt: '1 day ago',
        mutualFriends: 2,
        bio: 'Backend developer looking to expand into mobile development.',
      },
      {
        id: 'req3',
        userId: 'user_pending3',
        name: 'Ivy Taylor',
        username: 'ivy_student',
        image: 'https://picsum.photos/60/60?random=103',
        requestedAt: '3 days ago',
        mutualFriends: 0,
        bio: 'Computer science student passionate about mobile app development.',
      },
    ]);
  }, [groupId]);

  const filteredMembers = members.filter(member => {
    const matchesSearch = !searchQuery || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = 
      activeTab === 'members' ||
      (activeTab === 'admins' && (member.role === 'admin' || member.role === 'moderator'));

    return matchesSearch && matchesTab;
  });

  const handleMemberAction = (member: GroupMember, action: string) => {
    switch (action) {
      case 'promote':
        if (isAdmin) {
          const newRole = member.role === 'member' ? 'moderator' : 
                         member.role === 'moderator' ? 'admin' : 'member';
          Alert.alert(
            'Promote Member',
            `Promote ${member.name} to ${newRole}?`,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Promote',
                onPress: () => {
                  setMembers(prev => prev.map(m => 
                    m.id === member.id ? { ...m, role: newRole } : m
                  ));
                  Alert.alert('Success', `${member.name} has been promoted to ${newRole}`);
                }
              }
            ]
          );
        }
        break;

      case 'remove':
        if (isAdmin || (isModerator && member.role === 'member')) {
          Alert.alert(
            'Remove Member',
            `Are you sure you want to remove ${member.name} from the group?`,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Remove',
                style: 'destructive',
                onPress: () => {
                  setMembers(prev => prev.filter(m => m.id !== member.id));
                  Alert.alert('Removed', `${member.name} has been removed from the group`);
                }
              }
            ]
          );
        }
        break;

      case 'block':
        if (isAdmin || (isModerator && member.role === 'member')) {
          Alert.alert(
            member.isBlocked ? 'Unblock Member' : 'Block Member',
            `${member.isBlocked ? 'Unblock' : 'Block'} ${member.name}?`,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: member.isBlocked ? 'Unblock' : 'Block',
                style: member.isBlocked ? 'default' : 'destructive',
                onPress: () => {
                  setMembers(prev => prev.map(m => 
                    m.id === member.id ? { ...m, isBlocked: !m.isBlocked } : m
                  ));
                }
              }
            ]
          );
        }
        break;

      case 'mute':
        if (isAdmin || (isModerator && member.role === 'member')) {
          setMembers(prev => prev.map(m => 
            m.id === member.id ? { ...m, isMuted: !m.isMuted } : m
          ));
        }
        break;

      case 'message':
        navigation.navigate('MessageScreen', { 
          chatId: `private_${member.id}`,
          chatData: {
            id: `private_${member.id}`,
            type: 'private',
            participants: [{
              id: member.id,
              name: member.name,
              username: member.username,
              image: member.image,
              isOnline: member.isOnline,
              lastSeen: member.lastSeen,
            }]
          }
        });
        break;

      case 'profile':
        navigation.navigate('UserProfile', { userId: member.id });
        break;
    }
    setShowMemberModal(false);
  };

  const handleJoinRequest = (request: PendingRequest, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      const newMember: GroupMember = {
        id: request.userId,
        name: request.name,
        username: request.username,
        image: request.image,
        role: 'member',
        joinedAt: new Date().toISOString().split('T')[0],
        isOnline: false,
        postsCount: 0,
        contributionScore: 0,
        badges: [],
        bio: request.bio,
        isBlocked: false,
        isMuted: false,
      };

      setMembers(prev => [...prev, newMember]);
      setPendingRequests(prev => prev.filter(r => r.id !== request.id));
      Alert.alert('Approved', `${request.name} has been added to the group`);
    } else {
      setPendingRequests(prev => prev.filter(r => r.id !== request.id));
      Alert.alert('Rejected', `${request.name}'s request has been rejected`);
    }
  };

  const handleInviteMember = () => {
    if (!inviteUsername.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    // Mock invite
    Alert.alert('Invited', `Invitation sent to @${inviteUsername.trim()}`);
    setInviteUsername('');
    setShowInviteModal(false);
  };

  const formatContributionScore = (score: number): string => {
    if (score >= 90) return '🏆 Excellent';
    if (score >= 70) return '⭐ Good';
    if (score >= 50) return '👍 Average';
    if (score >= 30) return '📈 Growing';
    return '🌱 New';
  };

  const renderMember = (member: GroupMember) => (
    <TouchableOpacity
      key={member.id}
      style={[
        styles.memberCard,
        member.isBlocked && styles.blockedMemberCard,
        member.isMuted && styles.mutedMemberCard,
      ]}
      onPress={() => {
        setSelectedMember(member);
        setShowMemberModal(true);
      }}
    >
      <View style={styles.memberInfo}>
        <View style={styles.memberImageContainer}>
          <Image source={{ uri: member.image }} style={styles.memberImage} />
          {member.isOnline && <View style={styles.onlineIndicator} />}
          {member.isBlocked && (
            <View style={styles.blockedBadge}>
              <Text style={styles.blockedIcon}>🚫</Text>
            </View>
          )}
          {member.isMuted && (
            <View style={styles.mutedBadge}>
              <Text style={styles.mutedIcon}>🔇</Text>
            </View>
          )}
        </View>
        
        <View style={styles.memberDetails}>
          <View style={styles.memberHeader}>
            <Text style={styles.memberName} numberOfLines={1}>
              {member.name}
            </Text>
            <View style={[
              styles.roleBadge,
              member.role === 'admin' && styles.adminRoleBadge,
              member.role === 'moderator' && styles.moderatorRoleBadge,
            ]}>
              <Text style={[
                styles.roleText,
                member.role === 'admin' && styles.adminRoleText,
                member.role === 'moderator' && styles.moderatorRoleText,
              ]}>
                {member.role === 'admin' ? '👑 Admin' :
                 member.role === 'moderator' ? '⭐ Mod' : 'Member'}
              </Text>
            </View>
          </View>

          <Text style={styles.memberUsername}>@{member.username}</Text>

          {member.badges.length > 0 && (
            <View style={styles.badgesContainer}>
              {member.badges.map((badge, index) => (
                <Text key={index} style={styles.badge}>{badge}</Text>
              ))}
            </View>
          )}

          <View style={styles.memberStats}>
            <Text style={styles.statText}>
              📝 {member.postsCount} posts
            </Text>
            <Text style={styles.statText}>•</Text>
            <Text style={styles.statText}>
              {formatContributionScore(member.contributionScore)}
            </Text>
          </View>

          <View style={styles.memberMeta}>
            <Text style={styles.joinDate}>
              Joined {new Date(member.joinedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short' 
              })}
            </Text>
            <Text style={styles.onlineStatus}>
              {member.isOnline ? '🟢 Online' : `Last seen ${member.lastSeen || 'recently'}`}
            </Text>
          </View>

          {member.location && (
            <Text style={styles.location}>📍 {member.location}</Text>
          )}

          {member.bio && (
            <Text style={styles.bio} numberOfLines={2}>{member.bio}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPendingRequest = (request: PendingRequest) => (
    <View key={request.id} style={styles.requestCard}>
      <View style={styles.requestInfo}>
        <Image source={{ uri: request.image }} style={styles.requestImage} />
        
        <View style={styles.requestDetails}>
          <Text style={styles.requestName}>{request.name}</Text>
          <Text style={styles.requestUsername}>@{request.username}</Text>
          
          {request.mutualFriends > 0 && (
            <Text style={styles.mutualFriends}>
              👥 {request.mutualFriends} mutual friends
            </Text>
          )}
          
          <Text style={styles.requestTime}>
            Requested {request.requestedAt}
          </Text>
          
          {request.bio && (
            <Text style={styles.requestBio} numberOfLines={2}>
              {request.bio}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.requestActions}>
        <TouchableOpacity 
          style={[styles.requestButton, styles.approveButton]}
          onPress={() => handleJoinRequest(request, 'approve')}
        >
          <Text style={styles.approveButtonText}>Approve</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.requestButton, styles.rejectButton]}
          onPress={() => handleJoinRequest(request, 'reject')}
        >
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        
        <Text style={styles.headerTitle}>Group Members</Text>
        
        {isAdmin && (
          <TouchableOpacity 
            style={styles.inviteButton}
            onPress={() => setShowInviteModal(true)}
          >
            <Text style={styles.inviteIcon}>➕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search members..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { key: 'members', label: 'Members', count: members.filter(m => !m.isBlocked).length },
          { key: 'admins', label: 'Admins', count: members.filter(m => m.role === 'admin' || m.role === 'moderator').length },
          ...(isAdmin ? [{ key: 'pending', label: 'Pending', count: pendingRequests.length }] : []),
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
            {tab.count > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{tab.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'pending' ? (
          pendingRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>No pending requests</Text>
              <Text style={styles.emptyMessage}>
                All join requests have been processed
              </Text>
            </View>
          ) : (
            pendingRequests.map(renderPendingRequest)
          )
        ) : (
          filteredMembers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyTitle}>No members found</Text>
              <Text style={styles.emptyMessage}>
                {searchQuery 
                  ? "Try searching with different keywords"
                  : "No members in this category"
                }
              </Text>
            </View>
          ) : (
            filteredMembers.map(renderMember)
          )
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Member Detail Modal */}
      <Modal
        visible={showMemberModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowMemberModal(false)}>
              <Text style={styles.modalCancel}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Member Actions</Text>
            <View />
          </View>

          {selectedMember && (
            <View style={styles.modalContent}>
              {/* Member Info */}
              <View style={styles.modalMemberInfo}>
                <Image source={{ uri: selectedMember.image }} style={styles.modalMemberImage} />
                <Text style={styles.modalMemberName}>{selectedMember.name}</Text>
                <Text style={styles.modalMemberUsername}>@{selectedMember.username}</Text>
                <Text style={styles.modalMemberRole}>
                  {selectedMember.role === 'admin' ? '👑 Admin' :
                   selectedMember.role === 'moderator' ? '⭐ Moderator' : 'Member'}
                </Text>
              </View>

              {/* Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.modalActionButton}
                  onPress={() => handleMemberAction(selectedMember, 'profile')}
                >
                  <Text style={styles.modalActionText}>👤 View Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.modalActionButton}
                  onPress={() => handleMemberAction(selectedMember, 'message')}
                >
                  <Text style={styles.modalActionText}>💬 Send Message</Text>
                </TouchableOpacity>

                {/* Admin/Moderator Actions */}
                {(isAdmin || (isModerator && selectedMember.role === 'member')) && selectedMember.id !== currentUser.id && (
                  <>
                    {isAdmin && (
                      <TouchableOpacity 
                        style={styles.modalActionButton}
                        onPress={() => handleMemberAction(selectedMember, 'promote')}
                      >
                        <Text style={styles.modalActionText}>
                          {selectedMember.role === 'member' ? '⭐ Promote to Moderator' :
                           selectedMember.role === 'moderator' ? '👑 Promote to Admin' : '👤 Demote'}
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity 
                      style={styles.modalActionButton}
                      onPress={() => handleMemberAction(selectedMember, 'mute')}
                    >
                      <Text style={styles.modalActionText}>
                        {selectedMember.isMuted ? '🔊 Unmute' : '🔇 Mute'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.modalActionButton}
                      onPress={() => handleMemberAction(selectedMember, 'block')}
                    >
                      <Text style={[
                        styles.modalActionText,
                        selectedMember.isBlocked ? styles.positiveAction : styles.destructiveAction
                      ]}>
                        {selectedMember.isBlocked ? '✅ Unblock' : '🚫 Block'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.modalActionButton}
                      onPress={() => handleMemberAction(selectedMember, 'remove')}
                    >
                      <Text style={[styles.modalActionText, styles.destructiveAction]}>
                        🗑️ Remove from Group
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        visible={showInviteModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowInviteModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Invite Member</Text>
            <TouchableOpacity onPress={handleInviteMember}>
              <Text style={styles.modalInvite}>Invite</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.input}
                value={inviteUsername}
                onChangeText={setInviteUsername}
                placeholder="Enter username to invite"
                autoCapitalize="none"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
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
  inviteButton: {
    padding: 8,
  },
  inviteIcon: {
    fontSize: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearIcon: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#2196f3',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#ffffff',
  },
  tabBadge: {
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  memberCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  blockedMemberCard: {
    opacity: 0.6,
    backgroundColor: '#ffebee',
  },
  mutedMemberCard: {
    backgroundColor: '#f3e5f5',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  memberImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  memberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4caf50',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  blockedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#f44336',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockedIcon: {
    fontSize: 12,
  },
  mutedBadge: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    backgroundColor: '#9c27b0',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mutedIcon: {
    fontSize: 12,
  },
  memberDetails: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  adminRoleBadge: {
    backgroundColor: '#ff9800',
  },
  moderatorRoleBadge: {
    backgroundColor: '#2196f3',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  adminRoleText: {
    color: '#ffffff',
  },
  moderatorRoleText: {
    color: '#ffffff',
  },
  memberUsername: {
    fontSize: 14,
    color: '#2196f3',
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  badge: {
    fontSize: 16,
    marginRight: 4,
  },
  memberStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  memberMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 12,
    color: '#888',
  },
  onlineStatus: {
    fontSize: 12,
    color: '#888',
  },
  location: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  requestCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  requestImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  requestDetails: {
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  requestUsername: {
    fontSize: 14,
    color: '#2196f3',
    marginBottom: 4,
  },
  mutualFriends: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  requestTime: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  requestBio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  requestButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#4caf50',
  },
  approveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#f5f5f5',
  },
  rejectButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
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
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalCancel: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalInvite: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  modalMemberInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  modalMemberImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  modalMemberName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  modalMemberUsername: {
    fontSize: 16,
    color: '#2196f3',
    marginBottom: 8,
  },
  modalMemberRole: {
    fontSize: 14,
    color: '#666',
  },
  modalActions: {
    gap: 12,
  },
  modalActionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  modalActionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  destructiveAction: {
    color: '#f44336',
  },
  positiveAction: {
    color: '#4caf50',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
});