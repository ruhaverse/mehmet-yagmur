// Real-Time WebSocket Service
// Provides live updates without changing screen interfaces

import { store } from '../store/store';
import { feedActions, userActions, realTimeActions } from '../store/store';

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  userId?: string;
}

interface ConnectionConfig {
  url: string;
  autoReconnect: boolean;
  maxReconnectAttempts: number;
  reconnectInterval: number;
  heartbeatInterval: number;
}

class RealTimeService {
  private ws: WebSocket | null = null;
  private config: ConnectionConfig;
  private reconnectAttempts: number = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isConnecting: boolean = false;
  private eventListeners: Map<string, Function[]> = new Map();
  private messageQueue: WebSocketMessage[] = [];

  constructor() {
    this.config = {
      url: 'wss://api.shareuptime.com/ws', // Mock WebSocket URL
      autoReconnect: true,
      maxReconnectAttempts: 5,
      reconnectInterval: 5000, // 5 seconds
      heartbeatInterval: 30000, // 30 seconds
    };
  }

  /**
   * Connect to WebSocket server
   */
  async connect(userId: string, token: string): Promise<boolean> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return true;
    }

    if (this.isConnecting) {
      console.log('WebSocket connection in progress');
      return false;
    }

    try {
      this.isConnecting = true;
      store.dispatch(realTimeActions.setConnectionStatus('connecting'));

      const wsUrl = `${this.config.url}?userId=${userId}&token=${token}`;
      this.ws = new WebSocket(wsUrl);

      return new Promise((resolve) => {
        if (!this.ws) {
          resolve(false);
          return;
        }

        this.ws.onopen = () => {
          console.log('WebSocket connected successfully');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          
          store.dispatch(realTimeActions.setConnectionStatus('connected'));
          
          // Start heartbeat
          this.startHeartbeat();
          
          // Process queued messages
          this.processMessageQueue();
          
          // Emit connection event
          this.emit('connected', { userId });
          
          resolve(true);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket connection closed:', event.code, event.reason);
          this.isConnecting = false;
          this.stopHeartbeat();
          
          store.dispatch(realTimeActions.setConnectionStatus('disconnected'));
          
          // Attempt reconnection if enabled
          if (this.config.autoReconnect && this.reconnectAttempts < this.config.maxReconnectAttempts) {
            this.scheduleReconnect(userId, token);
          }
          
          this.emit('disconnected', { code: event.code, reason: event.reason });
          
          if (this.reconnectAttempts === 0) {
            resolve(false);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          
          store.dispatch(realTimeActions.setConnectionStatus('error'));
          
          this.emit('error', error);
          
          resolve(false);
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };
      });
      
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.isConnecting = false;
      store.dispatch(realTimeActions.setConnectionStatus('error'));
      return false;
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.ws) {
      this.config.autoReconnect = false;
      this.stopHeartbeat();
      this.clearReconnectTimer();
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    store.dispatch(realTimeActions.setConnectionStatus('disconnected'));
  }

  /**
   * Send message through WebSocket
   */
  send(type: string, payload: any): boolean {
    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: new Date().toISOString(),
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        return false;
      }
    } else {
      // Queue message for later sending
      this.messageQueue.push(message);
      console.log('WebSocket not connected, message queued');
      return false;
    }
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      // Update last activity
      store.dispatch(realTimeActions.updateLastActivity());
      
      // Handle different message types
      switch (message.type) {
        case 'new_post':
          this.handleNewPost(message.payload);
          break;
          
        case 'post_liked':
          this.handlePostLiked(message.payload);
          break;
          
        case 'post_commented':
          this.handlePostCommented(message.payload);
          break;
          
        case 'user_followed':
          this.handleUserFollowed(message.payload);
          break;
          
        case 'notification':
          this.handleNotification(message.payload);
          break;
          
        case 'user_online':
          this.handleUserOnline(message.payload);
          break;
          
        case 'user_offline':
          this.handleUserOffline(message.payload);
          break;
          
        case 'challenge_update':
          this.handleChallengeUpdate(message.payload);
          break;
          
        case 'time_post_active':
          this.handleTimePostActive(message.payload);
          break;
          
        case 'heartbeat':
          // Respond to server heartbeat
          this.send('heartbeat_response', { timestamp: new Date().toISOString() });
          break;
          
        default:
          console.log('Unknown message type:', message.type);
      }
      
      // Emit generic message event
      this.emit('message', message);
      
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Handle new post real-time update
   */
  private handleNewPost(payload: any): void {
    const { post } = payload;
    
    // Add post to feed if it matches current user's feed criteria
    const state = store.getState();
    const currentUser = state.user.currentUser;
    
    if (currentUser && this.shouldShowPostInFeed(post, currentUser)) {
      store.dispatch(feedActions.addPosts([post]));
    }
    
    this.emit('new_post', post);
  }

  /**
   * Handle post liked real-time update
   */
  private handlePostLiked(payload: any): void {
    const { postId, userId, likeCount } = payload;
    
    // Update post like count in store
    const state = store.getState();
    const post = state.feed.posts.find(p => p.id === postId);
    
    if (post) {
      const updatedPost = { ...post, likes: likeCount };
      store.dispatch(feedActions.updatePost(updatedPost));
    }
    
    this.emit('post_liked', payload);
  }

  /**
   * Handle post commented real-time update
   */
  private handlePostCommented(payload: any): void {
    const { postId, comment } = payload;
    
    // Update post comment count
    store.dispatch(feedActions.incrementComments(postId));
    
    this.emit('post_commented', payload);
  }

  /**
   * Handle user followed real-time update
   */
  private handleUserFollowed(payload: any): void {
    const { followerId, followingId } = payload;
    
    const state = store.getState();
    const currentUser = state.user.currentUser;
    
    if (currentUser?.id === followerId) {
      store.dispatch(userActions.addFollowing(followingId));
    }
    
    this.emit('user_followed', payload);
  }

  /**
   * Handle notification real-time update
   */
  private handleNotification(payload: any): void {
    const notification = payload;
    
    // Add notification to store
    store.dispatch(realTimeActions.addNotification(notification));
    
    this.emit('notification', notification);
  }

  /**
   * Handle user online status
   */
  private handleUserOnline(payload: any): void {
    const { userId } = payload;
    
    store.dispatch(realTimeActions.addOnlineUser(userId));
    this.emit('user_online', payload);
  }

  /**
   * Handle user offline status
   */
  private handleUserOffline(payload: any): void {
    const { userId } = payload;
    
    store.dispatch(realTimeActions.removeOnlineUser(userId));
    this.emit('user_offline', payload);
  }

  /**
   * Handle challenge update
   */
  private handleChallengeUpdate(payload: any): void {
    // Handle challenge-related updates
    this.emit('challenge_update', payload);
  }

  /**
   * Handle time-based post activation
   */
  private handleTimePostActive(payload: any): void {
    const { post } = payload;
    
    // Add time-based post to feed
    store.dispatch(feedActions.addPosts([post]));
    
    this.emit('time_post_active', post);
  }

  /**
   * Determine if post should be shown in current user's feed
   */
  private shouldShowPostInFeed(post: any, currentUser: any): boolean {
    // Basic logic - can be enhanced with more sophisticated filtering
    const state = store.getState();
    const followingUsers = state.user.followingUsers;
    
    // Show posts from followed users or public posts
    return followingUsers.includes(post.user.id) || post.visibility === 'public';
  }

  /**
   * Start heartbeat to maintain connection
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send('heartbeat', { timestamp: new Date().toISOString() });
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat timer
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(userId: string, token: string): void {
    this.reconnectAttempts++;
    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts}`);
    
    this.reconnectTimer = setTimeout(async () => {
      if (this.reconnectAttempts <= this.config.maxReconnectAttempts) {
        console.log('Attempting to reconnect...');
        await this.connect(userId, token);
      } else {
        console.log('Max reconnection attempts reached');
        store.dispatch(realTimeActions.setConnectionStatus('error'));
      }
    }, this.config.reconnectInterval);
  }

  /**
   * Clear reconnection timer
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Process queued messages when connection is restored
   */
  private processMessageQueue(): void {
    if (this.messageQueue.length > 0) {
      console.log(`Processing ${this.messageQueue.length} queued messages`);
      
      this.messageQueue.forEach(message => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(message));
        }
      });
      
      this.messageQueue = [];
    }
  }

  /**
   * Add event listener
   */
  on(eventType: string, callback: Function): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    
    this.eventListeners.get(eventType)!.push(callback);
  }

  /**
   * Remove event listener
   */
  off(eventType: string, callback: Function): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(eventType: string, data: any): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): string {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING: return 'disconnected';
      case WebSocket.CLOSED: return 'disconnected';
      default: return 'unknown';
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ConnectionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const realTimeService = new RealTimeService();
export default realTimeService;