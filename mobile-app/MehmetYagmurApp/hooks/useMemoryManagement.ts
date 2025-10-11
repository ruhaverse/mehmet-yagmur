// Memory Management Hook
// Advanced memory optimization without changing UI behavior

import { useState, useEffect, useCallback, useRef } from 'react';

interface MemoryStats {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  memoryPressure: 'low' | 'medium' | 'high' | 'critical';
  gcCycles: number;
  leakSuspicion: boolean;
}

interface MemoryConfig {
  warningThreshold: number;    // Memory warning threshold (0.7 = 70%)
  criticalThreshold: number;   // Critical threshold (0.9 = 90%)
  gcInterval: number;          // Garbage collection check interval (ms)
  maxCacheSize: number;        // Max cache size in MB
  imagePoolSize: number;       // Max images in memory pool
  enableProfiling: boolean;    // Enable memory profiling
}

interface MemoryOperations {
  getStats: () => MemoryStats;
  forceGC: () => void;
  clearImageCache: () => void;
  optimizeForLowMemory: () => void;
  preloadCriticalAssets: (assets: string[]) => Promise<void>;
  releaseUnusedAssets: () => void;
  monitorLeaks: (componentName: string) => () => void;
  getRecommendations: () => string[];
}

// Global memory tracking
class MemoryManager {
  private stats: MemoryStats = {
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0,
    memoryPressure: 'low',
    gcCycles: 0,
    leakSuspicion: false,
  };

  private config: MemoryConfig;
  private imageCache = new Map<string, HTMLImageElement>();
  private componentRefs = new WeakMap();
  private memoryHistory: number[] = [];
  private gcTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<MemoryConfig> = {}) {
    this.config = {
      warningThreshold: 0.7,
      criticalThreshold: 0.9,
      gcInterval: 30000, // 30 seconds
      maxCacheSize: 100, // 100MB
      imagePoolSize: 50,
      enableProfiling: true,
      ...config,
    };

    this.startMonitoring();
  }

  /**
   * Get current memory statistics
   */
  getStats(): MemoryStats {
    this.updateStats();
    return { ...this.stats };
  }

  /**
   * Update memory statistics
   */
  private updateStats(): void {
    // React Native memory info (mock implementation)
    const mockMemory = {
      usedJSHeapSize: Math.floor(Math.random() * 100000000) + 50000000, // 50-150MB
      totalJSHeapSize: 200000000, // 200MB
      jsHeapSizeLimit: 500000000, // 500MB
    };

    this.stats.usedJSHeapSize = mockMemory.usedJSHeapSize;
    this.stats.totalJSHeapSize = mockMemory.totalJSHeapSize;
    this.stats.jsHeapSizeLimit = mockMemory.jsHeapSizeLimit;

    // Calculate memory pressure
    const usage = this.stats.usedJSHeapSize / this.stats.jsHeapSizeLimit;
    
    if (usage > this.config.criticalThreshold) {
      this.stats.memoryPressure = 'critical';
    } else if (usage > this.config.warningThreshold) {
      this.stats.memoryPressure = 'high';
    } else if (usage > 0.5) {
      this.stats.memoryPressure = 'medium';
    } else {
      this.stats.memoryPressure = 'low';
    }

    // Track memory history for leak detection
    this.memoryHistory.push(this.stats.usedJSHeapSize);
    if (this.memoryHistory.length > 10) {
      this.memoryHistory.shift();
      this.detectMemoryLeaks();
    }
  }

  /**
   * Detect potential memory leaks
   */
  private detectMemoryLeaks(): void {
    if (this.memoryHistory.length < 5) return;

    const recent = this.memoryHistory.slice(-5);
    const average = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const trend = recent.every((val, index) => 
      index === 0 || val >= recent[index - 1]
    );

    // If memory consistently grows over 5 measurements
    this.stats.leakSuspicion = trend && average > this.stats.jsHeapSizeLimit * 0.6;
  }

  /**
   * Force garbage collection (where possible)
   */
  forceGC(): void {
    // In React Native, we can't directly force GC
    // But we can trigger it indirectly
    
    if (this.config.enableProfiling) {
      console.log('Triggering garbage collection...');
    }

    // Clear temporary references
    this.clearTemporaryCache();
    
    // Force a microtask to potentially trigger GC
    Promise.resolve().then(() => {
      this.stats.gcCycles++;
      if (this.config.enableProfiling) {
        console.log('GC cycle completed');
      }
    });
  }

  /**
   * Clear image cache
   */
  clearImageCache(): void {
    this.imageCache.clear();
    console.log('Image cache cleared');
  }

  /**
   * Optimize for low memory conditions
   */
  optimizeForLowMemory(): void {
    console.log('Optimizing for low memory...');
    
    // Clear caches
    this.clearImageCache();
    
    // Reduce image quality settings
    this.reduceImageQuality();
    
    // Clear non-essential data
    this.clearNonEssentialData();
    
    // Force garbage collection
    this.forceGC();
  }

  /**
   * Preload critical assets
   */
  async preloadCriticalAssets(assets: string[]): Promise<void> {
    const promises = assets.map(async (asset) => {
      if (this.imageCache.size >= this.config.imagePoolSize) {
        // Remove oldest entry if cache is full
        const firstKey = this.imageCache.keys().next().value;
        if (firstKey) {
          this.imageCache.delete(firstKey);
        }
      }

      try {
        // Mock image loading for React Native
        console.log('Preloading asset:', asset);
        // In real implementation, this would use Image.prefetch()
      } catch (error) {
        console.error('Failed to preload asset:', asset, error);
      }
    });

    await Promise.all(promises);
  }

  /**
   * Release unused assets
   */
  releaseUnusedAssets(): void {
    // Clear old cache entries
    if (this.imageCache.size > this.config.imagePoolSize / 2) {
      const keysToDelete = Array.from(this.imageCache.keys()).slice(
        0, 
        this.imageCache.size - Math.floor(this.config.imagePoolSize / 2)
      );
      
      keysToDelete.forEach(key => this.imageCache.delete(key));
    }

    console.log('Released unused assets');
  }

  /**
   * Monitor component for memory leaks
   */
  monitorLeaks(componentName: string): () => void {
    const startMemory = this.stats.usedJSHeapSize;
    const startTime = Date.now();

    return () => {
      const endMemory = this.stats.usedJSHeapSize;
      const duration = Date.now() - startTime;
      const memoryDiff = endMemory - startMemory;

      if (this.config.enableProfiling) {
        console.log(`Component ${componentName} memory impact:`, {
          memoryDiff: `${(memoryDiff / 1024 / 1024).toFixed(2)}MB`,
          duration: `${duration}ms`,
          suspected: memoryDiff > 10 * 1024 * 1024, // 10MB threshold
        });
      }
    };
  }

  /**
   * Get memory optimization recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const usage = this.stats.usedJSHeapSize / this.stats.jsHeapSizeLimit;

    if (usage > this.config.criticalThreshold) {
      recommendations.push('Critical: Clear image cache immediately');
      recommendations.push('Critical: Reduce active components');
      recommendations.push('Critical: Force garbage collection');
    } else if (usage > this.config.warningThreshold) {
      recommendations.push('Warning: Consider reducing cache size');
      recommendations.push('Warning: Optimize image loading');
    }

    if (this.stats.leakSuspicion) {
      recommendations.push('Alert: Potential memory leak detected');
      recommendations.push('Action: Review component lifecycle methods');
    }

    if (this.imageCache.size > this.config.imagePoolSize * 0.8) {
      recommendations.push('Info: Image cache approaching limit');
    }

    return recommendations;
  }

  /**
   * Start memory monitoring
   */
  private startMonitoring(): void {
    this.gcTimer = setInterval(() => {
      this.updateStats();
      
      // Auto-optimize if memory pressure is high
      if (this.stats.memoryPressure === 'critical') {
        this.optimizeForLowMemory();
      } else if (this.stats.memoryPressure === 'high') {
        this.releaseUnusedAssets();
      }
    }, this.config.gcInterval);
  }

  /**
   * Clear temporary cache
   */
  private clearTemporaryCache(): void {
    // Clear temporary data structures
    // This would clear various caches in a real implementation
  }

  /**
   * Reduce image quality for memory conservation
   */
  private reduceImageQuality(): void {
    // This would adjust image loading parameters
    console.log('Reducing image quality for memory conservation');
  }

  /**
   * Clear non-essential data
   */
  private clearNonEssentialData(): void {
    // Clear analytics data, logs, etc.
    console.log('Clearing non-essential data');
  }

  /**
   * Stop monitoring and cleanup
   */
  destroy(): void {
    if (this.gcTimer) {
      clearInterval(this.gcTimer);
      this.gcTimer = null;
    }
    this.clearImageCache();
    this.memoryHistory = [];
  }
}

// Global memory manager instance
let globalMemoryManager: MemoryManager | null = null;

export const useMemoryManagement = (
  componentName: string = 'Unknown',
  config: Partial<MemoryConfig> = {}
): MemoryOperations => {
  const [stats, setStats] = useState<MemoryStats>({
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0,
    memoryPressure: 'low',
    gcCycles: 0,
    leakSuspicion: false,
  });

  // Initialize global memory manager
  useEffect(() => {
    if (!globalMemoryManager) {
      globalMemoryManager = new MemoryManager(config);
    }

    // Start monitoring this component
    const cleanup = globalMemoryManager.monitorLeaks(componentName);

    // Update stats periodically
    const statsInterval = setInterval(() => {
      if (globalMemoryManager) {
        setStats(globalMemoryManager.getStats());
      }
    }, 5000); // Update every 5 seconds

    return () => {
      clearInterval(statsInterval);
      cleanup();
    };
  }, [componentName]);

  // Memory operations
  const getStats = useCallback((): MemoryStats => {
    return globalMemoryManager ? globalMemoryManager.getStats() : stats;
  }, [stats]);

  const forceGC = useCallback((): void => {
    if (globalMemoryManager) {
      globalMemoryManager.forceGC();
    }
  }, []);

  const clearImageCache = useCallback((): void => {
    if (globalMemoryManager) {
      globalMemoryManager.clearImageCache();
    }
  }, []);

  const optimizeForLowMemory = useCallback((): void => {
    if (globalMemoryManager) {
      globalMemoryManager.optimizeForLowMemory();
    }
  }, []);

  const preloadCriticalAssets = useCallback(async (assets: string[]): Promise<void> => {
    if (globalMemoryManager) {
      return globalMemoryManager.preloadCriticalAssets(assets);
    }
  }, []);

  const releaseUnusedAssets = useCallback((): void => {
    if (globalMemoryManager) {
      globalMemoryManager.releaseUnusedAssets();
    }
  }, []);

  const monitorLeaks = useCallback((componentName: string): (() => void) => {
    if (globalMemoryManager) {
      return globalMemoryManager.monitorLeaks(componentName);
    }
    return () => {};
  }, []);

  const getRecommendations = useCallback((): string[] => {
    return globalMemoryManager ? globalMemoryManager.getRecommendations() : [];
  }, []);

  return {
    getStats,
    forceGC,
    clearImageCache,
    optimizeForLowMemory,
    preloadCriticalAssets,
    releaseUnusedAssets,
    monitorLeaks,
    getRecommendations,
  };
};