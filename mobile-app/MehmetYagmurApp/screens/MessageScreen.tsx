import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location' | 'contact';
  timestamp: string;
  isRead: boolean;
  isDelivered: boolean;
  replyTo?: {
    messageId: string;
    content: string;
    senderName: string;
  };
  reactions?: {
    [userId: string]: string; // emoji reactions
  };
  attachments?: {
    type: string;
    url: string;
    fileName?: string;
    fileSize?: string;
    duration?: string;
  }[];
}

interface ChatInfo {
  id: string;
  type: 'private' | 'group';
  participants: Array<{
    id: string;
    name: string;
    username: string;
    image: string;
    isOnline: boolean;
    lastSeen?: string;
  }>;
  groupInfo?: {
    name: string;
    image: string;
    description: string;
    adminId: string;
    membersCount: number;
  };
}

const { width: screenWidth } = Dimensions.get('window');

export default function MessageScreen({ route, navigation }: any) {
  const { chatId, chatData } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [chatInfo, setChatInfo] = useState<ChatInfo>(chatData);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Mock messages
  useEffect(() => {
    setMessages([
      {
        id: 'msg1',
        senderId: 'user1',
        content: 'Hey! How are you doing today?',
        type: 'text',
        timestamp: '10:30 AM',
        isRead: true,
        isDelivered: true,
      },
      {
        id: 'msg2',
        senderId: 'me',
        content: 'I\'m doing great! Just finished working on a new project. How about you?',
        type: 'text',
        timestamp: '10:32 AM',
        isRead: true,
        isDelivered: true,
      },
      {
        id: 'msg3',
        senderId: 'user1',
        content: 'That sounds awesome! I\'d love to hear more about it.',
        type: 'text',
        timestamp: '10:33 AM',
        isRead: true,
        isDelivered: true,
      },
      {
        id: 'msg4',
        senderId: 'me',
        content: 'https://picsum.photos/300/200',
        type: 'image',
        timestamp: '10:35 AM',
        isRead: false,
        isDelivered: true,
        attachments: [{
          type: 'image',
          url: 'https://picsum.photos/300/200'
        }]
      },
      {
        id: 'msg5',
        senderId: 'user1',
        content: 'Wow! That looks amazing! 🔥',
        type: 'text',
        timestamp: '10:36 AM',
        isRead: false,
        isDelivered: true,
        replyTo: {
          messageId: 'msg4',
          content: 'Image',
          senderName: 'You'
        },
        reactions: {
          'me': '👍',
          'user2': '❤️'
        }
      },
    ]);

    // Simulate typing indicator
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }, 2000);
  }, []);

  const sendMessage = () => {
    if (messageInput.trim().length === 0) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      content: messageInput.trim(),
      type: 'text',
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      isRead: false,
      isDelivered: false,
      replyTo: replyingTo ? {
        messageId: replyingTo.id,
        content: replyingTo.content,
        senderName: replyingTo.senderId === 'me' ? 'You' : getUserName(replyingTo.senderId)
      } : undefined,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
    setReplyingTo(null);
    
    // Auto scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, isDelivered: true } : msg
      ));
    }, 1000);

    // Simulate message read
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, isRead: true } : msg
      ));
    }, 3000);
  };

  const getUserName = (userId: string): string => {
    if (chatInfo.type === 'private') {
      return chatInfo.participants.find(p => p.id === userId)?.name || 'Unknown';
    }
    return 'Group Member';
  };

  const getUserImage = (userId: string): string => {
    if (chatInfo.type === 'private') {
      return chatInfo.participants.find(p => p.id === userId)?.image || '';
    }
    return 'https://picsum.photos/40/40?random=' + userId;
  };

  const handleLongPress = (message: Message) => {
    setSelectedMessage(message.id);
    Alert.alert(
      'Message Options',
      'Choose an action',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setSelectedMessage(null) },
        { text: 'Reply', onPress: () => handleReply(message) },
        { text: 'React', onPress: () => handleReaction(message) },
        { text: 'Copy', onPress: () => handleCopy(message) },
        { text: 'Forward', onPress: () => handleForward(message) },
        ...(message.senderId === 'me' ? [
          { text: 'Edit', onPress: () => handleEdit(message) },
          { text: 'Delete', onPress: () => handleDelete(message), style: 'destructive' as const }
        ] : []),
      ]
    );
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    setSelectedMessage(null);
  };

  const handleReaction = (message: Message) => {
    setSelectedMessage(null);
    // For demo, add a random reaction
    const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
    
    setMessages(prev => prev.map(msg => 
      msg.id === message.id 
        ? { 
            ...msg, 
            reactions: { 
              ...msg.reactions, 
              me: randomReaction 
            }
          }
        : msg
    ));
  };

  const handleCopy = (message: Message) => {
    Alert.alert('Copied', `"${message.content}" copied to clipboard`);
    setSelectedMessage(null);
  };

  const handleForward = (message: Message) => {
    navigation.navigate('ForwardMessage', { message });
    setSelectedMessage(null);
  };

  const handleEdit = (message: Message) => {
    setMessageInput(message.content);
    setSelectedMessage(null);
  };

  const handleDelete = (message: Message) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setMessages(prev => prev.filter(msg => msg.id !== message.id));
            setSelectedMessage(null);
          }
        }
      ]
    );
  };

  const renderMessage = (message: Message, index: number) => {
    const isMe = message.senderId === 'me';
    const isLastInGroup = index === messages.length - 1 || 
      messages[index + 1]?.senderId !== message.senderId;
    const isFirstInGroup = index === 0 || 
      messages[index - 1]?.senderId !== message.senderId;

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isMe ? styles.myMessageContainer : styles.otherMessageContainer,
        ]}
      >
        {/* Avatar for other users */}
        {!isMe && isLastInGroup && (
          <Image
            source={{ uri: getUserImage(message.senderId) }}
            style={styles.messageAvatar}
          />
        )}
        {!isMe && !isLastInGroup && <View style={styles.avatarPlaceholder} />}

        <View style={styles.messageContent}>
          {/* Reply indicator */}
          {message.replyTo && (
            <View style={[
              styles.replyContainer,
              isMe ? styles.myReplyContainer : styles.otherReplyContainer
            ]}>
              <Text style={styles.replyToName}>{message.replyTo.senderName}</Text>
              <Text style={styles.replyToContent} numberOfLines={1}>
                {message.replyTo.content}
              </Text>
            </View>
          )}

          {/* Message bubble */}
          <TouchableOpacity
            style={[
              styles.messageBubble,
              isMe ? styles.myMessageBubble : styles.otherMessageBubble,
              selectedMessage === message.id && styles.selectedMessage,
            ]}
            onLongPress={() => handleLongPress(message)}
          >
            {/* Sender name for group chats */}
            {!isMe && chatInfo.type === 'group' && isFirstInGroup && (
              <Text style={styles.senderName}>
                {getUserName(message.senderId)}
              </Text>
            )}

            {/* Message content */}
            {message.type === 'text' ? (
              <Text style={[
                styles.messageText,
                isMe ? styles.myMessageText : styles.otherMessageText
              ]}>
                {message.content}
              </Text>
            ) : message.type === 'image' && message.attachments?.[0] ? (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: message.attachments[0].url }}
                  style={styles.messageImage}
                  resizeMode="cover"
                />
                {message.content && (
                  <Text style={[
                    styles.messageText,
                    isMe ? styles.myMessageText : styles.otherMessageText,
                    styles.imageCaption
                  ]}>
                    {message.content}
                  </Text>
                )}
              </View>
            ) : (
              <Text style={[
                styles.messageText,
                isMe ? styles.myMessageText : styles.otherMessageText
              ]}>
                {message.type === 'video' ? '🎥 Video' :
                 message.type === 'audio' ? '🎵 Audio' :
                 message.type === 'file' ? '📎 File' :
                 message.type === 'location' ? '📍 Location' :
                 message.type === 'contact' ? '👤 Contact' :
                 message.content}
              </Text>
            )}

            {/* Message reactions */}
            {message.reactions && Object.keys(message.reactions).length > 0 && (
              <View style={styles.reactionsContainer}>
                {Object.entries(message.reactions).map(([userId, emoji]) => (
                  <Text key={userId} style={styles.reaction}>
                    {emoji}
                  </Text>
                ))}
              </View>
            )}
          </TouchableOpacity>

          {/* Message status and time */}
          <View style={[
            styles.messageFooter,
            isMe ? styles.myMessageFooter : styles.otherMessageFooter
          ]}>
            <Text style={styles.messageTime}>{message.timestamp}</Text>
            {isMe && (
              <View style={styles.messageStatus}>
                {!message.isDelivered ? (
                  <Text style={styles.statusIcon}>🕐</Text>
                ) : !message.isRead ? (
                  <Text style={styles.statusIcon}>✓</Text>
                ) : (
                  <Text style={[styles.statusIcon, styles.readIcon]}>✓✓</Text>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.typingContainer}>
        <Image
          source={{ uri: getUserImage(chatInfo.participants[0]?.id || 'user1') }}
          style={styles.typingAvatar}
        />
        <View style={styles.typingBubble}>
          <View style={styles.typingDots}>
            <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '150ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '300ms' }]} />
          </View>
        </View>
      </View>
    );
  };

  const renderReplyBar = () => {
    if (!replyingTo) return null;

    return (
      <View style={styles.replyBar}>
        <View style={styles.replyBarContent}>
          <Text style={styles.replyBarTitle}>
            Replying to {replyingTo.senderId === 'me' ? 'yourself' : getUserName(replyingTo.senderId)}
          </Text>
          <Text style={styles.replyBarMessage} numberOfLines={1}>
            {replyingTo.content}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.replyBarClose}
          onPress={() => setReplyingTo(null)}
        >
          <Text style={styles.replyBarCloseIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    );
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

        <View style={styles.headerInfo}>
          <Image
            source={{ 
              uri: chatInfo.type === 'private' 
                ? chatInfo.participants[0]?.image 
                : chatInfo.groupInfo?.image 
            }}
            style={styles.headerAvatar}
          />
          <View style={styles.headerText}>
            <Text style={styles.headerName}>
              {chatInfo.type === 'private' 
                ? chatInfo.participants[0]?.name 
                : chatInfo.groupInfo?.name}
            </Text>
            <Text style={styles.headerStatus}>
              {chatInfo.type === 'private' 
                ? (chatInfo.participants[0]?.isOnline ? 'Online' : `Last seen ${chatInfo.participants[0]?.lastSeen || 'recently'}`)
                : `${chatInfo.groupInfo?.membersCount} members`}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonIcon}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonIcon}>🎥</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('ChatInfo', { chatId, chatInfo })}
          >
            <Text style={styles.headerButtonIcon}>ℹ️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View style={styles.messagesContent}>
            {messages.map(renderMessage)}
            {renderTypingIndicator()}
          </View>
        </ScrollView>

        {/* Reply Bar */}
        {renderReplyBar()}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachButton}>
              <Text style={styles.attachIcon}>📎</Text>
            </TouchableOpacity>

            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type a message..."
                value={messageInput}
                onChangeText={setMessageInput}
                multiline
                maxLength={1000}
                placeholderTextColor="#999"
              />
              <TouchableOpacity 
                style={styles.emojiButton}
                onPress={() => setShowEmojiPicker(true)}
              >
                <Text style={styles.emojiIcon}>😀</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                messageInput.trim().length > 0 && styles.sendButtonActive
              ]}
              onPress={sendMessage}
              disabled={messageInput.trim().length === 0}
            >
              <Text style={[
                styles.sendIcon,
                messageInput.trim().length > 0 && styles.sendIconActive
              ]}>
                ➤
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 4,
  },
  headerButtonIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 4,
  },
  avatarPlaceholder: {
    width: 40,
    marginRight: 8,
  },
  messageContent: {
    maxWidth: screenWidth * 0.75,
  },
  replyContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderRadius: 8,
  },
  myReplyContainer: {
    backgroundColor: '#e3f2fd',
    borderLeftColor: '#2196f3',
  },
  otherReplyContainer: {
    backgroundColor: '#f5f5f5',
    borderLeftColor: '#666',
  },
  replyToName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196f3',
    marginBottom: 2,
  },
  replyToContent: {
    fontSize: 12,
    color: '#666',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    position: 'relative',
  },
  myMessageBubble: {
    backgroundColor: '#2196f3',
    alignSelf: 'flex-end',
  },
  otherMessageBubble: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
  },
  selectedMessage: {
    opacity: 0.7,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196f3',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#ffffff',
  },
  otherMessageText: {
    color: '#333',
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  imageCaption: {
    marginTop: 8,
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  reaction: {
    fontSize: 14,
    marginRight: 4,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  myMessageFooter: {
    justifyContent: 'flex-end',
  },
  otherMessageFooter: {
    justifyContent: 'flex-start',
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
  },
  messageStatus: {
    marginLeft: 4,
  },
  statusIcon: {
    fontSize: 12,
    color: '#999',
  },
  readIcon: {
    color: '#2196f3',
  },
  typingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  typingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  typingBubble: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  typingDots: {
    flexDirection: 'row',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#999',
    marginRight: 4,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#e8f4f8',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  replyBarContent: {
    flex: 1,
  },
  replyBarTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196f3',
    marginBottom: 2,
  },
  replyBarMessage: {
    fontSize: 14,
    color: '#666',
  },
  replyBarClose: {
    padding: 8,
  },
  replyBarCloseIcon: {
    fontSize: 16,
    color: '#999',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  attachIcon: {
    fontSize: 20,
    color: '#666',
  },
  messageInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 80,
    paddingVertical: 4,
  },
  emojiButton: {
    padding: 4,
    marginLeft: 8,
  },
  emojiIcon: {
    fontSize: 18,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#2196f3',
  },
  sendIcon: {
    fontSize: 20,
    color: '#999',
  },
  sendIconActive: {
    color: '#ffffff',
  },
});