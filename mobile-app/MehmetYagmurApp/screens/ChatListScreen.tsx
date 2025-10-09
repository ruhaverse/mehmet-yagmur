import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  timestamp: string;
  isRead: boolean;
}

interface Chat {
  id: string;
  type: 'private' | 'group';
  participants: {
    id: string;
    name: string;
    username: string;
    image: string;
    isOnline: boolean;
    lastSeen?: string;
  }[];
  groupInfo?: {
    name: string;
    image: string;
    description: string;
    adminId: string;
    membersCount: number;
  };
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ChatListScreen({ navigation }: any) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'groups'>('all');

  // Mock data
  useEffect(() => {
    setChats([
      {
        id: 'chat1',
        type: 'private',
        participants: [
          {
            id: 'user1',
            name: 'Alice Johnson',
            username: 'alice_wonder',
            image: 'https://picsum.photos/60/60?random=1',
            isOnline: true,
          }
        ],
        lastMessage: {
          id: 'msg1',
          senderId: 'user1',
          content: 'Hey! How are you doing?',
          type: 'text',
          timestamp: '2 min ago',
          isRead: false,
        },
        unreadCount: 3,
        isPinned: true,
        isMuted: false,
        isArchived: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
      },
      {
        id: 'chat2',
        type: 'group',
        participants: [],
        groupInfo: {
          name: 'Team Developers',
          image: 'https://picsum.photos/60/60?random=20',
          description: 'Development team group chat',
          adminId: 'user2',
          membersCount: 12,
        },
        lastMessage: {
          id: 'msg2',
          senderId: 'user3',
          content: 'Meeting at 3 PM today',
          type: 'text',
          timestamp: '15 min ago',
          isRead: true,
        },
        unreadCount: 0,
        isPinned: false,
        isMuted: true,
        isArchived: false,
        createdAt: '2024-01-02',
        updatedAt: '2024-01-15',
      },
      {
        id: 'chat3',
        type: 'private',
        participants: [
          {
            id: 'user4',
            name: 'Bob Wilson',
            username: 'bob_photographer',
            image: 'https://picsum.photos/60/60?random=2',
            isOnline: false,
            lastSeen: '1 hour ago',
          }
        ],
        lastMessage: {
          id: 'msg3',
          senderId: 'me',
          content: 'Thanks for the photos! 📸',
          type: 'text',
          timestamp: '1 hour ago',
          isRead: true,
        },
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        isArchived: false,
        createdAt: '2024-01-03',
        updatedAt: '2024-01-14',
      },
      {
        id: 'chat4',
        type: 'group',
        participants: [],
        groupInfo: {
          name: 'Photography Club',
          image: 'https://picsum.photos/60/60?random=21',
          description: 'Share your best shots!',
          adminId: 'user5',
          membersCount: 25,
        },
        lastMessage: {
          id: 'msg4',
          senderId: 'user6',
          content: 'Amazing shot! 📷',
          type: 'text',
          timestamp: '2 hours ago',
          isRead: false,
        },
        unreadCount: 5,
        isPinned: false,
        isMuted: false,
        isArchived: false,
        createdAt: '2024-01-04',
        updatedAt: '2024-01-14',
      },
    ]);
  }, []);

  const filteredChats = chats.filter(chat => {
    const searchLower = searchQuery.toLowerCase();
    
    // Search filter
    const matchesSearch = !searchQuery || 
      (chat.type === 'private' 
        ? chat.participants[0]?.name.toLowerCase().includes(searchLower) ||
          chat.participants[0]?.username.toLowerCase().includes(searchLower)
        : chat.groupInfo?.name.toLowerCase().includes(searchLower)
      );

    // Tab filter
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'unread' && chat.unreadCount > 0) ||
      (activeTab === 'groups' && chat.type === 'group');

    return matchesSearch && matchesTab && !chat.isArchived;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleChatPress = (chat: Chat) => {
    navigation.navigate('MessageScreen', { chatId: chat.id, chatData: chat });
  };

  const handleLongPress = (chat: Chat) => {
    Alert.alert(
      'Chat Options',
      `Options for ${chat.type === 'private' ? chat.participants[0]?.name : chat.groupInfo?.name}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: chat.isPinned ? 'Unpin' : 'Pin',
          onPress: () => togglePin(chat.id)
        },
        {
          text: chat.isMuted ? 'Unmute' : 'Mute',
          onPress: () => toggleMute(chat.id)
        },
        {
          text: 'Archive',
          onPress: () => archiveChat(chat.id),
          style: 'destructive'
        },
      ]
    );
  };

  const togglePin = (chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
    ));
  };

  const toggleMute = (chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, isMuted: !chat.isMuted } : chat
    ));
  };

  const archiveChat = (chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, isArchived: true } : chat
    ));
  };

  const renderChatItem = (chat: Chat) => {
    const isGroup = chat.type === 'group';
    const participant = isGroup ? null : chat.participants[0];
    const displayName = isGroup ? chat.groupInfo?.name : participant?.name;
    const displayImage = isGroup ? chat.groupInfo?.image : participant?.image;
    const isOnline = !isGroup && participant?.isOnline;
    
    return (
      <TouchableOpacity
        key={chat.id}
        style={[styles.chatItem, chat.isPinned && styles.pinnedChat]}
        onPress={() => handleChatPress(chat)}
        onLongPress={() => handleLongPress(chat)}
      >
        <View style={styles.chatImageContainer}>
          <Image source={{ uri: displayImage }} style={styles.chatImage} />
          {isOnline && <View style={styles.onlineIndicator} />}
          {isGroup && (
            <View style={styles.groupBadge}>
              <Text style={styles.groupIcon}>👥</Text>
            </View>
          )}
          {chat.isPinned && (
            <View style={styles.pinBadge}>
              <Text style={styles.pinIcon}>📌</Text>
            </View>
          )}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>
              {displayName}
            </Text>
            <View style={styles.chatMeta}>
              {chat.isMuted && (
                <Text style={styles.muteIcon}>🔇</Text>
              )}
              <Text style={styles.timestamp}>
                {chat.lastMessage?.timestamp}
              </Text>
            </View>
          </View>

          <View style={styles.chatPreview}>
            <Text 
              style={[
                styles.lastMessage,
                chat.unreadCount > 0 && styles.unreadMessage
              ]} 
              numberOfLines={1}
            >
              {isGroup && chat.lastMessage?.senderId !== 'me' && (
                <Text style={styles.senderName}>
                  {chat.lastMessage?.senderId === 'user3' ? 'John: ' : 'Someone: '}
                </Text>
              )}
              {chat.lastMessage?.type === 'image' ? '📷 Photo' :
               chat.lastMessage?.type === 'video' ? '🎥 Video' :
               chat.lastMessage?.type === 'audio' ? '🎵 Voice message' :
               chat.lastMessage?.content || 'No messages yet'}
            </Text>
            
            {chat.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>
                  {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                </Text>
              </View>
            )}
          </View>

          {isGroup && (
            <Text style={styles.groupMembers}>
              {chat.groupInfo?.membersCount} members
            </Text>
          )}
          {!isGroup && !isOnline && participant?.lastSeen && (
            <Text style={styles.lastSeen}>
              Last seen {participant.lastSeen}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>💬</Text>
      <Text style={styles.emptyTitle}>No chats found</Text>
      <Text style={styles.emptyMessage}>
        {searchQuery 
          ? "Try searching with different keywords"
          : "Start a conversation with your friends!"
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('SearchUsers')}
          >
            <Text style={styles.headerIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('NewChat')}
          >
            <Text style={styles.headerIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
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

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { key: 'all', label: 'All', count: chats.length },
          { key: 'unread', label: 'Unread', count: chats.filter(c => c.unreadCount > 0).length },
          { key: 'groups', label: 'Groups', count: chats.filter(c => c.type === 'group').length },
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

      {/* Chat List */}
      <ScrollView
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredChats.length === 0 ? (
          renderEmptyState()
        ) : (
          filteredChats
            .sort((a, b) => {
              // Pinned chats first
              if (a.isPinned && !b.isPinned) return -1;
              if (!a.isPinned && b.isPinned) return 1;
              
              // Then by update time
              return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            })
            .map(renderChatItem)
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('ArchivedChats')}
        >
          <Text style={styles.quickActionIcon}>📦</Text>
          <Text style={styles.quickActionText}>Archived</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('CreateGroup')}
        >
          <Text style={styles.quickActionIcon}>👥</Text>
          <Text style={styles.quickActionText}>New Group</Text>
        </TouchableOpacity>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  headerIcon: {
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
    borderRadius: 20,
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
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pinnedChat: {
    backgroundColor: '#f8f9ff',
  },
  chatImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  chatImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  groupBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#666',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  groupIcon: {
    fontSize: 10,
  },
  pinBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff9800',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  pinIcon: {
    fontSize: 10,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  muteIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  chatPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  unreadMessage: {
    color: '#333',
    fontWeight: '500',
  },
  senderName: {
    fontWeight: '600',
    color: '#2196f3',
  },
  unreadBadge: {
    backgroundColor: '#2196f3',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  groupMembers: {
    fontSize: 12,
    color: '#888',
  },
  lastSeen: {
    fontSize: 12,
    color: '#888',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  quickActionButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
  },
  bottomPadding: {
    height: 20,
  },
});