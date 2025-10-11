// Caching Strategy Hook
// Advanced caching system for optimal performance without UI changes

import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheConfig {
  maxSize: number;          // Maximum cache size in MB
  defaultTTL: number;       // Default TTL in milliseconds
  checkInterval: number;    // Cleanup check interval in milliseconds
  persistToDisk: boolean;   // Whether to persist cache to disk
  compressionEnabled: boolean; // Enable data compression
}

interface CacheEntry<T = any> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number;
  size: number;             // Size in bytes
  accessCount: number;
  lastAccessed: number;
  priority: 'low' | 'medium' | 'high';
}

interface CacheStats {
  hitRate: number;
  missRate: number;
  totalSize: number;
  entryCount: number;
  lastCleanup: number;
}

interface CacheOperations<T = any> {
  get: (key: string) => Promise<T | null>;
  set: (key: string, data: T, ttl?: number, priority?: 'low' | 'medium' | 'high') => Promise<boolean>;
  delete: (key: string) => Promise<boolean>;
  clear: () => Promise<void>;
  has: (key: string) => boolean;
  getStats: () => CacheStats;
  invalidateByPattern: (pattern: RegExp) => Promise<void>;
  preload: (keys: string[]) => Promise<void>;
  warmup: (dataLoader: () => Promise<{ [key: string]: any }>) => Promise<void>;
}

class SmartCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;
  private stats = {
    hits: 0,
    misses: 0,
    lastCleanup: Date.now(),
  };
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 50 * 1024 * 1024, // 50MB default
      defaultTTL: 30 * 60 * 1000, // 30 minutes
      checkInterval: 5 * 60 * 1000, // 5 minutes
      persistToDisk: true,
      compressionEnabled: false,
      ...config,
    };

    this.startCleanupTimer();
  }

  /**
   * Get item from cache
   */
  async get(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if entry is expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.hits++;

    return entry.data;
  }

  /**
   * Set item in cache
   */
  async set(
    key: string, 
    data: T, 
    ttl: number = this.config.defaultTTL,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<boolean> {
    try {
      const size = this.calculateSize(data);
      
      // Check if we need to make space
      if (this.getTotalSize() + size > this.config.maxSize) {
        await this.evictEntries(size);
      }

      const entry: CacheEntry<T> = {
        key,
        data,
        timestamp: Date.now(),
        ttl,
        size,
        accessCount: 0,
        lastAccessed: Date.now(),
        priority,
      };

      this.cache.set(key, entry);
      return true;

    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete item from cache
   */
  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  /**
   * Clear entire cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? !this.isExpired(entry) : false;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    
    return {
      hitRate: totalRequests > 0 ? this.stats.hits / totalRequests : 0,
      missRate: totalRequests > 0 ? this.stats.misses / totalRequests : 0,
      totalSize: this.getTotalSize(),
      entryCount: this.cache.size,
      lastCleanup: this.stats.lastCleanup,
    };
  }

  /**
   * Invalidate cache entries by pattern
   */
  async invalidateByPattern(pattern: RegExp): Promise<void> {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Preload cache with specific keys
   */
  async preload(keys: string[]): Promise<void> {
    // This would typically fetch data for the keys
    console.log('Preloading cache keys:', keys);
  }

  /**
   * Warm up cache with data
   */
  async warmup(dataLoader: () => Promise<{ [key: string]: any }>): Promise<void> {
    try {
      const data = await dataLoader();
      
      for (const [key, value] of Object.entries(data)) {
        await this.set(key, value);
      }
      
      console.log(`Cache warmed up with ${Object.keys(data).length} entries`);
    } catch (error) {
      console.error('Cache warmup error:', error);
    }
  }

  /**
   * Check if cache entry is expired
   */
  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Calculate approximate size of data
   */
  private calculateSize(data: any): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      // Fallback estimation
      return JSON.stringify(data).length * 2; // Rough estimate
    }
  }

  /**
   * Get total cache size
   */
  private getTotalSize(): number {
    let totalSize = 0;
    for (const entry of this.cache.values()) {
      totalSize += entry.size;
    }
    return totalSize;
  }

  /**
   * Evict entries to make space
   */
  private async evictEntries(requiredSpace: number): Promise<void> {
    const entries = Array.from(this.cache.values());
    
    // Sort by priority and access patterns (LRU + priority)
    entries.sort((a, b) => {
      // Priority order: high > medium > low
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // If same priority, use LRU (least recently used)
      return a.lastAccessed - b.lastAccessed;
    });

    let freedSpace = 0;
    for (const entry of entries) {
      if (freedSpace >= requiredSpace) break;
      
      this.cache.delete(entry.key);
      freedSpace += entry.size;
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));
    this.stats.lastCleanup = now;

    console.log(`Cache cleanup: removed ${expiredKeys.length} expired entries`);
  }

  /**
   * Start automatic cleanup timer
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.checkInterval);
  }

  /**
   * Stop cleanup timer
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.cache.clear();
  }
}

export const useCache = <T = any>(
  namespace: string = 'default',
  config: Partial<CacheConfig> = {}
): CacheOperations<T> => {
  // Create cache instance per namespace
  const cacheRef = useRef<SmartCache<T>>();
  const [stats, setStats] = useState<CacheStats>({
    hitRate: 0,
    missRate: 0,
    totalSize: 0,
    entryCount: 0,
    lastCleanup: Date.now(),
  });

  // Initialize cache
  useEffect(() => {
    cacheRef.current = new SmartCache<T>(config);
    
    // Update stats periodically
    const statsInterval = setInterval(() => {
      if (cacheRef.current) {
        setStats(cacheRef.current.getStats());
      }
    }, 10000); // Update every 10 seconds

    return () => {
      clearInterval(statsInterval);
      if (cacheRef.current) {
        cacheRef.current.destroy();
      }
    };
  }, []);

  // Cache operations
  const get = useCallback(async (key: string): Promise<T | null> => {
    if (!cacheRef.current) return null;
    return cacheRef.current.get(`${namespace}:${key}`);
  }, [namespace]);

  const set = useCallback(async (
    key: string, 
    data: T, 
    ttl?: number, 
    priority?: 'low' | 'medium' | 'high'
  ): Promise<boolean> => {
    if (!cacheRef.current) return false;
    return cacheRef.current.set(`${namespace}:${key}`, data, ttl, priority);
  }, [namespace]);

  const deleteKey = useCallback(async (key: string): Promise<boolean> => {
    if (!cacheRef.current) return false;
    return cacheRef.current.delete(`${namespace}:${key}`);
  }, [namespace]);

  const clear = useCallback(async (): Promise<void> => {
    if (!cacheRef.current) return;
    return cacheRef.current.clear();
  }, []);

  const has = useCallback((key: string): boolean => {
    if (!cacheRef.current) return false;
    return cacheRef.current.has(`${namespace}:${key}`);
  }, [namespace]);

  const getStats = useCallback((): CacheStats => {
    return stats;
  }, [stats]);

  const invalidateByPattern = useCallback(async (pattern: RegExp): Promise<void> => {
    if (!cacheRef.current) return;
    return cacheRef.current.invalidateByPattern(pattern);
  }, []);

  const preload = useCallback(async (keys: string[]): Promise<void> => {
    if (!cacheRef.current) return;
    const namespacedKeys = keys.map(key => `${namespace}:${key}`);
    return cacheRef.current.preload(namespacedKeys);
  }, [namespace]);

  const warmup = useCallback(async (dataLoader: () => Promise<{ [key: string]: any }>): Promise<void> => {
    if (!cacheRef.current) return;
    return cacheRef.current.warmup(dataLoader);
  }, []);

  return {
    get,
    set,
    delete: deleteKey,
    clear,
    has,
    getStats,
    invalidateByPattern,
    preload,
    warmup,
  };
};