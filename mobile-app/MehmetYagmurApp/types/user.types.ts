// User Types for Enhanced Services
// Supports backend services without changing UI

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePicture: string;
  coverImage?: string;
  bio?: string;
  isVerified: boolean;
  isOnline: boolean;
  lastSeen?: string;
  
  // Social metrics
  followerCount: number;
  followingCount: number;
  postCount: number;
  isFollowing: boolean;
  isFollowedBy: boolean;
  
  // Privacy settings
  isPrivate: boolean;
  allowMessages: boolean;
  showOnlineStatus: boolean;
  
  // Profile details
  dateOfBirth?: string;
  location?: string;
  website?: string;
  phone?: string;
  joinDate: string;
  
  // Enhanced user preferences for feed algorithm
  preferences?: {
    categories: string[];
    contentTypes: string[];
    timePreferences: {
      morningActivity: boolean;
      workHoursActivity: boolean;
      eveningActivity: boolean;
      nightActivity: boolean;
    };
    notificationSettings: {
      likes: boolean;
      comments: boolean;
      follows: boolean;
      messages: boolean;
      challenges: boolean;
      timeReminders: boolean;
    };
    privacySettings: {
      profileVisibility: 'public' | 'friends' | 'private';
      postVisibility: 'public' | 'friends' | 'private';
      storyVisibility: 'public' | 'friends' | 'private';
      allowTagging: boolean;
      allowMentions: boolean;
    };
  };
  
  // Activity tracking for algorithm
  activityMetrics?: {
    averageSessionDuration: number; // minutes
    dailyActiveHours: number[];
    preferredContentTypes: Record<string, number>;
    engagementRate: number;
    lastActiveTime: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
  };
  
  // Achievements and gamification
  achievements?: {
    badges: Badge[];
    level: number;
    points: number;
    streak: {
      current: number;
      longest: number;
      type: 'daily_post' | 'challenge_participation' | 'time_based_activity';
    };
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedDate: string;
  category: 'social' | 'content' | 'challenge' | 'time' | 'special';
}

export interface UserProfile extends User {
  // Extended profile information
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    tiktok?: string;
    youtube?: string;
  };
  
  interests?: string[];
  languages?: string[];
  education?: {
    institution: string;
    degree: string;
    year: number;
  }[];
  
  work?: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
  }[];
}

export interface UserStats {
  userId: string;
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalFollowers: number;
  totalFollowing: number;
  
  // Time-based stats
  timeBased: {
    totalTimePosts: number;
    averagePostDuration: number;
    mostActiveTimeRange: string;
    completedChallenges: number;
  };
  
  // Weekly/Monthly metrics
  weeklyStats: {
    postsThisWeek: number;
    engagementThisWeek: number;
    newFollowersThisWeek: number;
    challengesJoinedThisWeek: number;
  };
  
  monthlyStats: {
    postsThisMonth: number;
    engagementThisMonth: number;
    newFollowersThisMonth: number;
    challengesCompletedThisMonth: number;
  };
}

export interface UserRelationship {
  userId: string;
  targetUserId: string;
  type: 'following' | 'follower' | 'friend' | 'blocked' | 'muted';
  createdAt: string;
  isClose: boolean; // For close friends feature
}

export interface UserActivity {
  userId: string;
  type: 'post_created' | 'post_liked' | 'post_commented' | 'user_followed' | 'challenge_joined' | 'time_post_participated';
  targetId: string; // ID of the post, user, challenge, etc.
  timestamp: string;
  metadata?: Record<string, any>;
}