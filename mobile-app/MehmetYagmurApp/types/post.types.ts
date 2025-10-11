// Post Types for Enhanced Feed Service
// Maintains compatibility with existing screens

export interface User {
  id: string;
  name: string;
  username?: string;
  profilePicture: string;
  isVerified: boolean;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  isOnline?: boolean;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

export interface Post {
  id: string;
  user: User;
  content: string;
  images?: string[];
  videos?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  location?: string;
  tags?: string[];
  type: 'post' | 'reel' | 'swap' | 'challenge' | 'time_based';
  
  // Enhanced fields for feed algorithm
  engagement?: {
    totalEngagement: number;
    engagementRate: number;
    recentLikes: number;
    recentComments: number;
    viewCount?: number;
  };
  
  // Time-based post specific fields
  timeConstraints?: {
    startTime: string;
    endTime: string;
    duration?: number; // in minutes
    isActive: boolean;
    participantCount?: number;
  };
  
  // Challenge specific fields
  challenge?: {
    id: string;
    title: string;
    description: string;
    participantCount: number;
    endDate: string;
    isParticipating: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  
  // Swap specific fields
  swap?: {
    offeredItem: string;
    requestedItem: string;
    condition: string;
    isAvailable: boolean;
    estimatedValue?: number;
    category: string;
  };
}

export interface Story {
  id: string;
  user: User;
  content: string;
  image?: string;
  video?: string;
  timestamp: string;
  views: number;
  isViewed: boolean;
  duration?: number;
  type: 'image' | 'video' | 'text';
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'challenge' | 'time_reminder';
  user: User;
  post?: Post;
  timestamp: string;
  isRead: boolean;
  content: string;
  actionUrl?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'video' | 'audio' | 'location';
  mediaUrl?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  isOnline: boolean;
  timestamp: string;
}

export interface Challenge {
  id: string;
  creator: User;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  startDate: string;
  endDate: string;
  participantCount: number;
  maxParticipants?: number;
  isParticipating: boolean;
  participants?: User[];
  rules?: string[];
  reward?: {
    type: 'badge' | 'points' | 'item';
    value: string;
    description: string;
  };
  status: 'upcoming' | 'active' | 'completed';
}