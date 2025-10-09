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
  Switch,
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
}

interface GroupInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  createdBy: string;
  members: GroupMember[];
  settings: {
    whoCanAddMembers: 'admins' | 'all';
    whoCanEditInfo: 'admins' | 'all';
    whoCanSendMessages: 'all' | 'adminsOnly';
    approveMembers: boolean;
    allowMediaMessages: boolean;
    allowLinks: boolean;
  };
  inviteLink: string;
}

export default function GroupChatScreen({ route, navigation }: any) {
  const { groupId } = route.params;
  
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
  });
  const [newMemberUsername, setNewMemberUsername] = useState('');

  // Mock data
  useEffect(() => {
    setGroupInfo({
      id: groupId,
      name: 'Team Developers',
      description: 'Development team group chat for daily standups and project discussions',
      image: 'https://picsum.photos/120/120?random=20',
      createdAt: '2024-01-01',
      createdBy: 'user1',
      inviteLink: 'https://shareuptime.com/invite/abc123',
      settings: {
        whoCanAddMembers: 'admins',
        whoCanEditInfo: 'admins',
        whoCanSendMessages: 'all',
        approveMembers: true,
        allowMediaMessages: true,
        allowLinks: true,
      },
      members: [
        {
          id: 'user1',
          name: 'John Smith',
          username: 'john_admin',
          image: 'https://picsum.photos/60/60?random=1',
          role: 'admin',
          joinedAt: '2024-01-01',
          isOnline: true,
        },
        {
          id: 'user2',
          name: 'Alice Johnson',
          username: 'alice_dev',
          image: 'https://picsum.photos/60/60?random=2',
          role: 'moderator',
          joinedAt: '2024-01-02',
          isOnline: false,
          lastSeen: '2 hours ago',
        },
        {
          id: 'user3',
          name: 'Bob Wilson',
          username: 'bob_designer',
          image: 'https://picsum.photos/60/60?random=3',
          role: 'member',
          joinedAt: '2024-01-03',
          isOnline: true,
        },
        {
          id: 'user4',
          name: 'Carol Davis',
          username: 'carol_pm',
          image: 'https://picsum.photos/60/60?random=4',
          role: 'member',
          joinedAt: '2024-01-04',
          isOnline: false,
          lastSeen: '1 day ago',
        },
        {
          id: 'user5',
          name: 'David Brown',
          username: 'david_qa',
          image: 'https://picsum.photos/60/60?random=5',
          role: 'member',
          joinedAt: '2024-01-05',
          isOnline: true,
        },
      ],
    });
  }, [groupId]);

  useEffect(() => {
    if (groupInfo) {
      setEditForm({
        name: groupInfo.name,
        description: groupInfo.description,
      });
    }
  }, [groupInfo]);

  if (!groupInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading group info...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentUser = groupInfo.members.find(m => m.id === 'me') || groupInfo.members[0];
  const isAdmin = currentUser.role === 'admin';
  const isModerator = currentUser.role === 'admin' || currentUser.role === 'moderator';

  const handleEditGroup = () => {
    if (!editForm.name.trim()) {
      Alert.alert('Error', 'Group name is required');
      return;
    }

    setGroupInfo(prev => prev ? {
      ...prev,
      name: editForm.name.trim(),
      description: editForm.description.trim(),
    } : null);

    setShowEditModal(false);
    Alert.alert('Success', 'Group info updated successfully');
  };

  const handleAddMember = () => {
    if (!newMemberUsername.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    // Mock adding member
    const newMember: GroupMember = {
      id: `user_${Date.now()}`,
      name: 'New User',
      username: newMemberUsername.trim(),
      image: `https://picsum.photos/60/60?random=${Date.now()}`,
      role: 'member',
      joinedAt: new Date().toISOString().split('T')[0],
      isOnline: false,
    };

    setGroupInfo(prev => prev ? {
      ...prev,
      members: [...prev.members, newMember],
    } : null);

    setNewMemberUsername('');
    setShowAddMemberModal(false);
    Alert.alert('Success', `${newMemberUsername} has been added to the group`);
  };

  const handleRemoveMember = (memberId: string) => {
    const member = groupInfo.members.find(m => m.id === memberId);
    if (!member) return;

    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${member.name} from the group?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setGroupInfo(prev => prev ? {
              ...prev,
              members: prev.members.filter(m => m.id !== memberId),
            } : null);
          }
        }
      ]
    );
  };

  const handlePromoteMember = (memberId: string) => {
    const member = groupInfo.members.find(m => m.id === memberId);
    if (!member) return;

    const newRole = member.role === 'member' ? 'moderator' : 
                   member.role === 'moderator' ? 'admin' : 'member';

    Alert.alert(
      'Change Role',
      `Promote ${member.name} to ${newRole}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setGroupInfo(prev => prev ? {
              ...prev,
              members: prev.members.map(m => 
                m.id === memberId ? { ...m, role: newRole } : m
              ),
            } : null);
          }
        }
      ]
    );
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      'Leave Group',
      'Are you sure you want to leave this group?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
          }
        }
      ]
    );
  };

  const copyInviteLink = () => {
    Alert.alert('Copied', 'Invite link copied to clipboard');
  };

  const updateSetting = (key: keyof GroupInfo['settings'], value: any) => {
    setGroupInfo(prev => prev ? {
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value,
      },
    } : null);
  };

  const renderMember = (member: GroupMember) => (
    <View key={member.id} style={styles.memberItem}>
      <View style={styles.memberInfo}>
        <View style={styles.memberImageContainer}>
          <Image source={{ uri: member.image }} style={styles.memberImage} />
          {member.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.memberDetails}>
          <View style={styles.memberHeader}>
            <Text style={styles.memberName}>{member.name}</Text>
            <View style={styles.memberRole}>
              <Text style={[
                styles.roleText,
                member.role === 'admin' && styles.adminRole,
                member.role === 'moderator' && styles.moderatorRole,
              ]}>
                {member.role}
              </Text>
            </View>
          </View>
          
          <Text style={styles.memberUsername}>@{member.username}</Text>
          
          <Text style={styles.memberStatus}>
            {member.isOnline ? 'Online' : `Last seen ${member.lastSeen || 'recently'}`}
          </Text>
          
          <Text style={styles.memberJoined}>
            Joined {new Date(member.joinedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {(isAdmin || (isModerator && member.role === 'member')) && member.id !== currentUser.id && (
        <View style={styles.memberActions}>
          <TouchableOpacity 
            style={styles.memberActionButton}
            onPress={() => handlePromoteMember(member.id)}
          >
            <Text style={styles.actionButtonText}>
              {member.role === 'member' ? '👑' : member.role === 'moderator' ? '⭐' : '👤'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.memberActionButton, styles.removeButton]}
            onPress={() => handleRemoveMember(member.id)}
          >
            <Text style={styles.removeButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      )}
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
        
        <Text style={styles.headerTitle}>Group Info</Text>
        
        {isAdmin && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
          >
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Header */}
        <View style={styles.groupHeader}>
          <Image source={{ uri: groupInfo.image }} style={styles.groupImage} />
          <Text style={styles.groupName}>{groupInfo.name}</Text>
          <Text style={styles.groupDescription}>{groupInfo.description}</Text>
          
          <View style={styles.groupStats}>
            <Text style={styles.groupStat}>
              {groupInfo.members.length} members
            </Text>
            <Text style={styles.groupStat}>•</Text>
            <Text style={styles.groupStat}>
              Created {new Date(groupInfo.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('MessageScreen', { 
              chatId: groupInfo.id, 
              chatData: { 
                id: groupInfo.id, 
                type: 'group',
                groupInfo: {
                  name: groupInfo.name,
                  image: groupInfo.image,
                  membersCount: groupInfo.members.length
                }
              } 
            })}
          >
            <Text style={styles.quickActionIcon}>💬</Text>
            <Text style={styles.quickActionText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => setShowMembersModal(true)}
          >
            <Text style={styles.quickActionIcon}>👥</Text>
            <Text style={styles.quickActionText}>Members</Text>
          </TouchableOpacity>

          {(isAdmin || groupInfo.settings.whoCanAddMembers === 'all') && (
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => setShowAddMemberModal(true)}
            >
              <Text style={styles.quickActionIcon}>➕</Text>
              <Text style={styles.quickActionText}>Add</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.quickAction}
            onPress={copyInviteLink}
          >
            <Text style={styles.quickActionIcon}>🔗</Text>
            <Text style={styles.quickActionText}>Invite</Text>
          </TouchableOpacity>
        </View>

        {/* Members Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Members ({groupInfo.members.length})</Text>
            <TouchableOpacity onPress={() => setShowMembersModal(true)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {groupInfo.members.slice(0, 5).map(renderMember)}
        </View>

        {/* Group Settings */}
        {isAdmin && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(true)}>
                <Text style={styles.seeAllText}>Manage</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Who can add members</Text>
              <Text style={styles.settingValue}>
                {groupInfo.settings.whoCanAddMembers === 'admins' ? 'Admins only' : 'Everyone'}
              </Text>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Approve new members</Text>
              <Text style={styles.settingValue}>
                {groupInfo.settings.approveMembers ? 'Enabled' : 'Disabled'}
              </Text>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Media messages</Text>
              <Text style={styles.settingValue}>
                {groupInfo.settings.allowMediaMessages ? 'Allowed' : 'Not allowed'}
              </Text>
            </View>
          </View>
        )}

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.leaveButton]}
            onPress={handleLeaveGroup}
          >
            <Text style={styles.leaveButtonText}>Leave Group</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Group Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Group</Text>
            <TouchableOpacity onPress={handleEditGroup}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Group Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
                placeholder="Enter group name"
                maxLength={50}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editForm.description}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, description: text }))}
                placeholder="Enter group description"
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Members Modal */}
      <Modal
        visible={showMembersModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowMembersModal(false)}>
              <Text style={styles.modalCancel}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>All Members</Text>
            <View />
          </View>

          <ScrollView style={styles.modalContent}>
            {groupInfo.members.map(renderMember)}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        visible={showAddMemberModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddMemberModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Member</Text>
            <TouchableOpacity onPress={handleAddMember}>
              <Text style={styles.modalSave}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.input}
                value={newMemberUsername}
                onChangeText={setNewMemberUsername}
                placeholder="Enter username"
                autoCapitalize="none"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
              <Text style={styles.modalCancel}>Done</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Group Settings</Text>
            <View />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.settingSection}>
              <Text style={styles.settingSectionTitle}>Permissions</Text>
              
              <View style={styles.settingRow}>
                <View>
                  <Text style={styles.settingLabel}>Approve new members</Text>
                  <Text style={styles.settingDescription}>
                    Admins must approve new members before they can join
                  </Text>
                </View>
                <Switch
                  value={groupInfo.settings.approveMembers}
                  onValueChange={(value) => updateSetting('approveMembers', value)}
                />
              </View>

              <View style={styles.settingRow}>
                <View>
                  <Text style={styles.settingLabel}>Allow media messages</Text>
                  <Text style={styles.settingDescription}>
                    Members can send photos, videos, and files
                  </Text>
                </View>
                <Switch
                  value={groupInfo.settings.allowMediaMessages}
                  onValueChange={(value) => updateSetting('allowMediaMessages', value)}
                />
              </View>

              <View style={styles.settingRow}>
                <View>
                  <Text style={styles.settingLabel}>Allow links</Text>
                  <Text style={styles.settingDescription}>
                    Members can send web links in messages
                  </Text>
                </View>
                <Switch
                  value={groupInfo.settings.allowLinks}
                  onValueChange={(value) => updateSetting('allowLinks', value)}
                />
              </View>
            </View>
          </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
  editButton: {
    padding: 8,
  },
  editIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  groupHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  groupImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  groupName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  groupStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupStat: {
    fontSize: 14,
    color: '#888',
    marginHorizontal: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  quickAction: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 16,
    color: '#2196f3',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  memberInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  memberImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4caf50',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  memberDetails: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  memberRole: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
  },
  adminRole: {
    backgroundColor: '#ff9800',
    color: '#ffffff',
  },
  moderatorRole: {
    backgroundColor: '#2196f3',
    color: '#ffffff',
  },
  memberUsername: {
    fontSize: 14,
    color: '#2196f3',
    marginBottom: 2,
  },
  memberStatus: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  memberJoined: {
    fontSize: 12,
    color: '#aaa',
  },
  memberActions: {
    flexDirection: 'row',
  },
  memberActionButton: {
    padding: 8,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#ffebee',
    borderRadius: 20,
  },
  removeButtonText: {
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  leaveButton: {
    backgroundColor: '#ffebee',
  },
  leaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f44336',
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
  modalSave: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  settingSection: {
    marginBottom: 24,
  },
  settingSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});