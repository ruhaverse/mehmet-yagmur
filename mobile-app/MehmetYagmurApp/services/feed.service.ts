// Enhanced Feed Service
// Provides intelligent content curation without changing UI

import { Post } from '../types/post.types';
import { User } from '../types/user.types';

interface FeedAlgorithmConfig {
  timeBasedWeight: number;
  friendActivityWeight: number;
  interactionWeight: number;
  contentTypeWeight: number;
  recencyWeight: number;
}

interface ContentScore {
  postId: string;
  score: number;
  factors: {
    timeBased: number;
    friendActivity: number;
    interactions: number;
    contentType: number;
    recency: number;
  };
}

interface UserPreferences {
  userId: string;
  favoriteCategories: string[];
  activeTimeRanges: { start: number; end: number }[];
  friendInteractionFrequency: Record<string, number>;
  contentTypePreferences: Record<string, number>;
}

class EnhancedFeedService {
  private algorithmConfig: FeedAlgorithmConfig = {
    timeBasedWeight: 0.25,      // Time-based posts priority
    friendActivityWeight: 0.30, // Friend activity correlation
    interactionWeight: 0.20,    // User interaction history
    contentTypeWeight: 0.15,    // Content type preferences
    recencyWeight: 0.10,        // Post recency factor
  };

  /**
   * Generate personalized feed based on user preferences and time context
   * This replaces mock data in NewsFeedScreen without UI changes
   */
  async generatePersonalizedFeed(
    userId: string, 
    limit: number = 20,
    offset: number = 0
  ): Promise<Post[]> {
    try {
      // Get user preferences and context
      const userPreferences = await this.getUserPreferences(userId);
      const currentTime = new Date();
      
      // Fetch candidate posts (would be from API in production)
      const candidatePosts = await this.fetchCandidatePosts(userId, limit * 3);
      
      // Score each post based on algorithm
      const scoredPosts = await Promise.all(
        candidatePosts.map(post => this.scorePost(post, userPreferences, currentTime))
      );
      
      // Sort by score and apply time-based adjustments
      const sortedPosts = scoredPosts
        .sort((a, b) => b.score - a.score)
        .slice(offset, offset + limit);
      
      // Convert back to Post objects maintaining original structure
      return sortedPosts.map(scored => 
        candidatePosts.find(post => post.id === scored.postId)!
      );
      
    } catch (error) {
      console.error('Feed generation error:', error);
      // Fallback to basic feed
      return this.getBasicFeed(userId, limit, offset);
    }
  }

  /**
   * Score individual post based on multiple factors
   */
  private async scorePost(
    post: Post, 
    userPreferences: UserPreferences, 
    currentTime: Date
  ): Promise<ContentScore> {
    const factors = {
      timeBased: this.calculateTimeBasedScore(post, currentTime),
      friendActivity: this.calculateFriendActivityScore(post, userPreferences),
      interactions: this.calculateInteractionScore(post, userPreferences),
      contentType: this.calculateContentTypeScore(post, userPreferences),
      recency: this.calculateRecencyScore(post, currentTime),
    };

    const totalScore = 
      factors.timeBased * this.algorithmConfig.timeBasedWeight +
      factors.friendActivity * this.algorithmConfig.friendActivityWeight +
      factors.interactions * this.algorithmConfig.interactionWeight +
      factors.contentType * this.algorithmConfig.contentTypeWeight +
      factors.recency * this.algorithmConfig.recencyWeight;

    return {
      postId: post.id,
      score: totalScore,
      factors,
    };
  }

  /**
   * Time-based scoring for ShareUpTime's unique feature
   */
  private calculateTimeBasedScore(post: Post, currentTime: Date): number {
    const postTime = new Date(post.timestamp);
    const timeDifference = Math.abs(currentTime.getTime() - postTime.getTime());
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    // Prioritize posts from specific time ranges
    const currentHour = currentTime.getHours();
    
    // Morning posts (6-10 AM) get boost in morning
    if (currentHour >= 6 && currentHour <= 10) {
      const postHour = postTime.getHours();
      if (postHour >= 6 && postHour <= 10) return 1.0;
    }
    
    // Work time posts (9-17) get boost during work hours
    if (currentHour >= 9 && currentHour <= 17) {
      const postHour = postTime.getHours();
      if (postHour >= 9 && postHour <= 17) return 0.9;
    }
    
    // Evening posts (18-22) get boost in evening
    if (currentHour >= 18 && currentHour <= 22) {
      const postHour = postTime.getHours();
      if (postHour >= 18 && postHour <= 22) return 0.8;
    }

    // General recency scoring
    if (hoursDifference < 1) return 0.7;
    if (hoursDifference < 6) return 0.5;
    if (hoursDifference < 24) return 0.3;
    return 0.1;
  }

  /**
   * Friend activity correlation scoring
   */
  private calculateFriendActivityScore(post: Post, userPreferences: UserPreferences): number {
    const authorId = post.user.id;
    const interactionFreq = userPreferences.friendInteractionFrequency[authorId] || 0;
    
    // High interaction friends get priority
    if (interactionFreq > 10) return 1.0;
    if (interactionFreq > 5) return 0.7;
    if (interactionFreq > 1) return 0.5;
    return 0.2;
  }

  /**
   * User interaction history scoring
   */
  private calculateInteractionScore(post: Post, userPreferences: UserPreferences): number {
    // Check if post contains user's favorite categories/topics
    const favoriteCategories = userPreferences.favoriteCategories;
    const postContent = post.content.toLowerCase();
    
    let categoryMatch = 0;
    favoriteCategories.forEach(category => {
      if (postContent.includes(category.toLowerCase())) {
        categoryMatch += 0.2;
      }
    });

    // Engagement metrics boost
    const engagementScore = Math.min(
      (post.likes + post.comments * 2 + post.shares * 3) / 100,
      1.0
    );

    return Math.min(categoryMatch + engagementScore, 1.0);
  }

  /**
   * Content type preferences scoring
   */
  private calculateContentTypeScore(post: Post, userPreferences: UserPreferences): number {
    let contentType = 'text';
    
    if (post.images && post.images.length > 0) contentType = 'image';
    if (post.videos && post.videos.length > 0) contentType = 'video';
    if (post.type === 'reel') contentType = 'reel';
    if (post.type === 'swap') contentType = 'swap';

    return userPreferences.contentTypePreferences[contentType] || 0.5;
  }

  /**
   * Recency scoring with decay function
   */
  private calculateRecencyScore(post: Post, currentTime: Date): number {
    const postTime = new Date(post.timestamp);
    const hoursSincePost = (currentTime.getTime() - postTime.getTime()) / (1000 * 60 * 60);
    
    // Exponential decay function
    return Math.exp(-hoursSincePost / 24); // Half-life of 24 hours
  }

  /**
   * Get user preferences (would be from API/cache)
   */
  private async getUserPreferences(userId: string): Promise<UserPreferences> {
    // Mock data - in production this would come from user profile API
    return {
      userId,
      favoriteCategories: ['technology', 'fitness', 'education', 'travel'],
      activeTimeRanges: [
        { start: 7, end: 9 },   // Morning
        { start: 12, end: 13 }, // Lunch
        { start: 18, end: 22 }, // Evening
      ],
      friendInteractionFrequency: {
        'user_2': 15, // High interaction
        'user_3': 8,  // Medium interaction
        'user_4': 3,  // Low interaction
      },
      contentTypePreferences: {
        'image': 0.9,
        'video': 0.7,
        'text': 0.6,
        'reel': 0.8,
        'swap': 0.5,
      },
    };
  }

  /**
   * Fetch candidate posts for scoring
   */
  private async fetchCandidatePosts(userId: string, limit: number): Promise<Post[]> {
    // Mock implementation - in production this would be API call
    // This maintains the same Post structure as existing NewsFeedScreen
    return [
      {
        id: '1',
        user: {
          id: 'user_2',
          name: 'John Doe',
          profilePicture: 'https://picsum.photos/40/40?random=6',
          isVerified: true,
        },
        content: 'Just finished a great workout session! 💪 Feeling energized for the day ahead. #fitness #morning',
        images: ['https://picsum.photos/350/250?random=20'],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        likes: 124,
        comments: 18,
        shares: 5,
        isLiked: false,
        isBookmarked: false,
        location: 'Local Gym',
        type: 'post',
      },
      {
        id: '2',
        user: {
          id: 'user_3',
          name: 'Sarah Smith',
          profilePicture: 'https://picsum.photos/40/40?random=7',
          isVerified: false,
        },
        content: 'Working on a new tech project today! Exciting developments in AI and machine learning. #technology #work',
        images: ['https://picsum.photos/350/250?random=21'],
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        likes: 89,
        comments: 12,
        shares: 3,
        isLiked: true,
        isBookmarked: false,
        type: 'post',
      },
      // Add more mock posts as needed...
    ];
  }

  /**
   * Fallback basic feed when algorithm fails
   */
  private async getBasicFeed(userId: string, limit: number, offset: number): Promise<Post[]> {
    // Simple chronological feed as fallback
    return this.fetchCandidatePosts(userId, limit);
  }

  /**
   * Update algorithm weights based on user feedback
   */
  updateAlgorithmConfig(newConfig: Partial<FeedAlgorithmConfig>): void {
    this.algorithmConfig = { ...this.algorithmConfig, ...newConfig };
  }

  /**
   * Get feed analytics for performance monitoring
   */
  async getFeedAnalytics(userId: string, timeRange: 'day' | 'week' | 'month') {
    return {
      totalPostsShown: 0,
      averageEngagementRate: 0,
      timeBasedPostsPercentage: 0,
      userSatisfactionScore: 0,
    };
  }
}

export const feedService = new EnhancedFeedService();
export default feedService;