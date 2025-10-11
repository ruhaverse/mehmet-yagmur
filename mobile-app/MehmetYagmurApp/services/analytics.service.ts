// Analytics Service
// Advanced user behavior tracking without affecting existing UI

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: string;
  userId?: string | null;
  sessionId: string;
}

interface UserProperties {
  userId: string;
  email?: string;
  name?: string;
  signupDate: string;
  lastActiveDate: string;
  deviceInfo: {
    platform: string;
    version: string;
    model: string;
    screenSize: string;
  };
  preferences: Record<string, any>;
}

interface PerformanceMetric {
  metric: string;
  value: number;
  timestamp: string;
  screen?: string;
  additionalData?: Record<string, any>;
}

interface ABTestVariant {
  testId: string;
  variantId: string;
  userId: string;
  assignedAt: string;
  convertedAt?: string;
}

/**
 * Analytics Service
 * Comprehensive user behavior and performance tracking
 */
class AnalyticsService {
  private isInitialized: boolean = false;
  private sessionId: string = '';
  private userId: string | null = null;
  private eventQueue: AnalyticsEvent[] = [];
  private performanceQueue: PerformanceMetric[] = [];
  private isOnline: boolean = true;
  private flushInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize analytics service
   */
  async initialize(userId?: string): Promise<boolean> {
    try {
      console.log('📊 Initializing Analytics Service...');
      
      if (this.isInitialized) {
        console.log('✅ Analytics already initialized');
        return true;
      }

      // Generate session ID
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.userId = userId || null;

      // Start automatic event flushing
      this.startEventFlushing();

      // Track app launch
      await this.trackEvent('app_launched', {
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });

      this.isInitialized = true;
      console.log('✅ Analytics Service initialized successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Analytics Service initialization failed:', error);
      return false;
    }
  }

  /**
   * Track custom event
   */
  async trackEvent(eventName: string, properties?: Record<string, any>): Promise<void> {
    try {
      const event: AnalyticsEvent = {
        name: eventName,
        properties: {
          ...properties,
          platform: 'react-native',
          appVersion: '1.0.0'
        },
        timestamp: new Date().toISOString(),
        userId: this.userId,
        sessionId: this.sessionId
      };

      // Add to queue
      this.eventQueue.push(event);
      
      console.log('📈 Event tracked:', eventName, properties);
      
      // Flush immediately for important events
      const immediateFlushEvents = ['app_launched', 'user_login', 'purchase', 'error'];
      if (immediateFlushEvents.includes(eventName)) {
        await this.flushEvents();
      }
      
    } catch (error) {
      console.error('❌ Error tracking event:', error);
    }
  }

  /**
   * Track screen view
   */
  async trackScreenView(screenName: string, properties?: Record<string, any>): Promise<void> {
    await this.trackEvent('screen_view', {
      screen_name: screenName,
      ...properties
    });
  }

  /**
   * Track user interaction
   */
  async trackUserInteraction(
    elementType: string, 
    elementId: string, 
    action: string,
    properties?: Record<string, any>
  ): Promise<void> {
    await this.trackEvent('user_interaction', {
      element_type: elementType,
      element_id: elementId,
      action,
      ...properties
    });
  }

  /**
   * Track performance metric
   */
  async trackPerformance(
    metric: string, 
    value: number, 
    screen?: string,
    additionalData?: Record<string, any>
  ): Promise<void> {
    try {
      const performanceMetric: PerformanceMetric = {
        metric,
        value,
        timestamp: new Date().toISOString(),
        ...(screen && { screen }),
        ...(additionalData && { additionalData })
      };

      this.performanceQueue.push(performanceMetric);
      
      console.log('⚡ Performance metric tracked:', metric, value);
      
    } catch (error) {
      console.error('❌ Error tracking performance:', error);
    }
  }

  /**
   * Set user properties
   */
  async setUserProperties(properties: Partial<UserProperties>): Promise<void> {
    try {
      console.log('👤 Setting user properties:', Object.keys(properties));
      
      // In real implementation, would send to analytics backend
      await this.trackEvent('user_properties_updated', { properties });
      
    } catch (error) {
      console.error('❌ Error setting user properties:', error);
    }
  }

  /**
   * Track conversion event
   */
  async trackConversion(
    conversionType: string, 
    value?: number, 
    currency?: string,
    properties?: Record<string, any>
  ): Promise<void> {
    await this.trackEvent('conversion', {
      conversion_type: conversionType,
      value,
      currency,
      ...properties
    });
  }

  /**
   * Track error event
   */
  async trackError(
    error: Error, 
    context?: string,
    additionalData?: Record<string, any>
  ): Promise<void> {
    await this.trackEvent('error_occurred', {
      error_message: error.message,
      error_stack: error.stack,
      error_context: context,
      ...additionalData
    });
  }

  /**
   * Start A/B test tracking
   */
  async assignABTestVariant(testId: string, userId: string): Promise<string> {
    try {
      // Simple variant assignment (A or B)
      const variants = ['A', 'B'];
      const variantIndex = userId.charCodeAt(userId.length - 1) % 2;
      const variantId = variants[variantIndex];
      
      await this.trackEvent('ab_test_assigned', {
        test_id: testId,
        variant_id: variantId,
        user_id: userId
      });
      
      console.log(`🧪 A/B Test assigned: ${testId} -> ${variantId}`);
      return variantId;
      
    } catch (error) {
      console.error('❌ Error assigning A/B test variant:', error);
      return 'A'; // Default to A
    }
  }

  /**
   * Track A/B test conversion
   */
  async trackABTestConversion(
    testId: string, 
    variantId: string, 
    conversionType: string
  ): Promise<void> {
    await this.trackEvent('ab_test_conversion', {
      test_id: testId,
      variant_id: variantId,
      conversion_type: conversionType,
      converted_at: new Date().toISOString()
    });
  }

  /**
   * Track funnel step
   */
  async trackFunnelStep(
    funnelName: string, 
    stepName: string, 
    stepNumber: number,
    properties?: Record<string, any>
  ): Promise<void> {
    await this.trackEvent('funnel_step', {
      funnel_name: funnelName,
      step_name: stepName,
      step_number: stepNumber,
      ...properties
    });
  }

  /**
   * Track retention event
   */
  async trackRetention(daysSinceInstall: number, isRetained: boolean): Promise<void> {
    await this.trackEvent('retention_check', {
      days_since_install: daysSinceInstall,
      is_retained: isRetained,
      retention_period: this.getRetentionPeriod(daysSinceInstall)
    });
  }

  /**
   * Get retention period label
   */
  private getRetentionPeriod(days: number): string {
    if (days <= 1) return 'day_1';
    if (days <= 7) return 'week_1';
    if (days <= 30) return 'month_1';
    if (days <= 90) return 'month_3';
    return 'long_term';
  }

  /**
   * Start automatic event flushing
   */
  private startEventFlushing(): void {
    // Flush events every 30 seconds
    this.flushInterval = setInterval(async () => {
      await this.flushEvents();
      await this.flushPerformanceMetrics();
    }, 30000);
  }

  /**
   * Flush queued events to backend
   */
  private async flushEvents(): Promise<void> {
    try {
      if (this.eventQueue.length === 0) return;
      
      const events = [...this.eventQueue];
      this.eventQueue = []; // Clear queue
      
      console.log(`📤 Flushing ${events.length} analytics events...`);
      
      // In real implementation, would send to analytics backend
      // await this.sendEventsToBackend(events);
      
      console.log('✅ Analytics events flushed successfully');
      
    } catch (error) {
      console.error('❌ Error flushing analytics events:', error);
      
      // Re-add failed events to queue (with limit to prevent infinite growth)
      if (this.eventQueue.length < 1000) {
        this.eventQueue.unshift(...this.eventQueue);
      }
    }
  }

  /**
   * Flush queued performance metrics
   */
  private async flushPerformanceMetrics(): Promise<void> {
    try {
      if (this.performanceQueue.length === 0) return;
      
      const metrics = [...this.performanceQueue];
      this.performanceQueue = []; // Clear queue
      
      console.log(`⚡ Flushing ${metrics.length} performance metrics...`);
      
      // In real implementation, would send to performance monitoring backend
      // await this.sendMetricsToBackend(metrics);
      
      console.log('✅ Performance metrics flushed successfully');
      
    } catch (error) {
      console.error('❌ Error flushing performance metrics:', error);
      
      // Re-add failed metrics to queue
      if (this.performanceQueue.length < 500) {
        this.performanceQueue.unshift(...this.performanceQueue);
      }
    }
  }

  /**
   * Set online/offline status
   */
  setOnlineStatus(isOnline: boolean): void {
    this.isOnline = isOnline;
    
    if (isOnline && (this.eventQueue.length > 0 || this.performanceQueue.length > 0)) {
      // Flush queued events when coming back online
      this.flushEvents();
      this.flushPerformanceMetrics();
    }
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary(): {
    sessionId: string;
    userId: string | null;
    queuedEvents: number;
    queuedMetrics: number;
    isOnline: boolean;
  } {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      queuedEvents: this.eventQueue.length,
      queuedMetrics: this.performanceQueue.length,
      isOnline: this.isOnline
    };
  }

  /**
   * Clean up analytics service
   */
  cleanup(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    // Flush remaining events before cleanup
    this.flushEvents();
    this.flushPerformanceMetrics();
    
    console.log('🧹 Analytics Service cleaned up');
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;