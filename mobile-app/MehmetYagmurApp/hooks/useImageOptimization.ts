// Image Optimization Hook
// Advanced image loading and optimization without UI changes

import { useState, useCallback, useEffect } from 'react';

interface ImageConfig {
  quality: 'low' | 'medium' | 'high' | 'auto';
  format: 'webp' | 'jpeg' | 'png' | 'auto';
  enableLazyLoading: boolean;
  enableProgressive: boolean;
  enableCaching: boolean;
  cacheDuration: number; // in milliseconds
  maxConcurrentLoads: number;
  enablePlaceholder: boolean;
  enableBlur: boolean;
  resizeStrategy: 'cover' | 'contain' | 'stretch' | 'center';
}

interface ImageState {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  progress: number;
  dimensions: { width: number; height: number } | null;
  optimizedUri: string | null;
  cacheHit: boolean;
}

interface ImageOperations {
  loadImage: (uri: string, config?: Partial<ImageConfig>) => Promise<string>;
  preloadImages: (uris: string[]) => Promise<void>;
  clearCache: () => void;
  getCacheStats: () => ImageCacheStats;
  optimizeForNetworkType: (networkType: string) => void;
  generateThumbnail: (uri: string, size: number) => Promise<string>;
  compressImage: (uri: string, quality: number) => Promise<string>;
  getImageDimensions: (uri: string) => Promise<{ width: number; height: number }>;
}

interface ImageCacheStats {
  totalImages: number;
  cacheSize: number; // in bytes
  hitRate: number;
  missRate: number;
  lastClearTime: number;
}

// Image optimization utilities
class ImageOptimizer {
  private cache = new Map<string, { uri: string; timestamp: number; size: number }>();
  private loadingQueue: Array<{ uri: string; resolve: Function; reject: Function }> = [];
  private activeLoads = 0;
  private config: ImageConfig;
  private stats = {
    hits: 0,
    misses: 0,
    totalSize: 0,
    lastClear: Date.now(),
  };

  constructor(config: Partial<ImageConfig> = {}) {
    this.config = {
      quality: 'auto',
      format: 'auto',
      enableLazyLoading: true,
      enableProgressive: true,
      enableCaching: true,
      cacheDuration: 24 * 60 * 60 * 1000, // 24 hours
      maxConcurrentLoads: 3,
      enablePlaceholder: true,
      enableBlur: true,
      resizeStrategy: 'cover',
      ...config,
    };
  }

  /**
   * Load and optimize image
   */
  async loadImage(uri: string, customConfig?: Partial<ImageConfig>): Promise<string> {
    const finalConfig = { ...this.config, ...customConfig };
    
    // Check cache first
    if (finalConfig.enableCaching) {
      const cached = this.getCachedImage(uri);
      if (cached) {
        this.stats.hits++;
        return cached;
      }
    }

    this.stats.misses++;

    // Add to loading queue if too many concurrent loads
    if (this.activeLoads >= finalConfig.maxConcurrentLoads) {
      return new Promise((resolve, reject) => {
        this.loadingQueue.push({ uri, resolve, reject });
      });
    }

    return this.processImage(uri, finalConfig);
  }

  /**
   * Process image with optimization
   */
  private async processImage(uri: string, config: ImageConfig): Promise<string> {
    this.activeLoads++;

    try {
      // Generate optimized URI based on config
      const optimizedUri = this.generateOptimizedUri(uri, config);
      
      // Simulate image processing (in production this would use actual image processing)
      await this.simulateImageProcessing(optimizedUri);

      // Cache the result
      if (config.enableCaching) {
        this.cacheImage(uri, optimizedUri);
      }

      // Process next in queue
      this.processQueue();

      return optimizedUri;

    } catch (error) {
      console.error('Image processing error:', error);
      throw error;
    } finally {
      this.activeLoads--;
    }
  }

  /**
   * Generate optimized URI
   */
  private generateOptimizedUri(uri: string, config: ImageConfig): string {
    const params = new URLSearchParams();

    // Quality optimization
    if (config.quality !== 'auto') {
      const qualityMap = { low: 40, medium: 70, high: 90 };
      params.append('quality', qualityMap[config.quality].toString());
    }

    // Format optimization
    if (config.format !== 'auto') {
      params.append('format', config.format);
    }

    // Progressive loading
    if (config.enableProgressive) {
      params.append('progressive', 'true');
    }

    // Add optimization parameters to URI
    const separator = uri.includes('?') ? '&' : '?';
    return params.toString() ? `${uri}${separator}${params.toString()}` : uri;
  }

  /**
   * Simulate image processing delay
   */
  private async simulateImageProcessing(uri: string): Promise<void> {
    // Simulate processing time based on image complexity
    const processingTime = Math.random() * 500 + 100; // 100-600ms
    await new Promise(resolve => setTimeout(resolve, processingTime));
  }

  /**
   * Get cached image
   */
  private getCachedImage(uri: string): string | null {
    const cached = this.cache.get(uri);
    
    if (!cached) return null;

    // Check if cache is expired
    const isExpired = Date.now() - cached.timestamp > this.config.cacheDuration;
    if (isExpired) {
      this.cache.delete(uri);
      this.stats.totalSize -= cached.size;
      return null;
    }

    return cached.uri;
  }

  /**
   * Cache image
   */
  private cacheImage(originalUri: string, optimizedUri: string): void {
    const size = originalUri.length + optimizedUri.length; // Approximate size
    
    this.cache.set(originalUri, {
      uri: optimizedUri,
      timestamp: Date.now(),
      size,
    });

    this.stats.totalSize += size;
  }

  /**
   * Process loading queue
   */
  private processQueue(): void {
    if (this.loadingQueue.length > 0 && this.activeLoads < this.config.maxConcurrentLoads) {
      const { uri, resolve, reject } = this.loadingQueue.shift()!;
      
      this.processImage(uri, this.config)
        .then(resolve)
        .catch(reject);
    }
  }

  /**
   * Preload multiple images
   */
  async preloadImages(uris: string[]): Promise<void> {
    const promises = uris.map(uri => 
      this.loadImage(uri).catch(error => {
        console.error('Preload failed for:', uri, error);
        return null;
      })
    );

    await Promise.all(promises);
    console.log(`Preloaded ${uris.length} images`);
  }

  /**
   * Clear image cache
   */
  clearCache(): void {
    this.cache.clear();
    this.stats.totalSize = 0;
    this.stats.lastClear = Date.now();
    console.log('Image cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): ImageCacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    
    return {
      totalImages: this.cache.size,
      cacheSize: this.stats.totalSize,
      hitRate: totalRequests > 0 ? this.stats.hits / totalRequests : 0,
      missRate: totalRequests > 0 ? this.stats.misses / totalRequests : 0,
      lastClearTime: this.stats.lastClear,
    };
  }

  /**
   * Optimize for network type
   */
  optimizeForNetworkType(networkType: string): void {
    switch (networkType.toLowerCase()) {
      case 'wifi':
        this.config.quality = 'high';
        this.config.maxConcurrentLoads = 5;
        break;
      case '4g':
        this.config.quality = 'medium';
        this.config.maxConcurrentLoads = 3;
        break;
      case '3g':
        this.config.quality = 'low';
        this.config.maxConcurrentLoads = 2;
        break;
      case '2g':
        this.config.quality = 'low';
        this.config.maxConcurrentLoads = 1;
        break;
      default:
        this.config.quality = 'auto';
        this.config.maxConcurrentLoads = 3;
    }

    console.log(`Image optimization adjusted for ${networkType}`);
  }

  /**
   * Generate thumbnail
   */
  async generateThumbnail(uri: string, size: number): Promise<string> {
    // Mock thumbnail generation
    const thumbnailUri = `${uri}?thumbnail=true&size=${size}`;
    await this.simulateImageProcessing(thumbnailUri);
    return thumbnailUri;
  }

  /**
   * Compress image
   */
  async compressImage(uri: string, quality: number): Promise<string> {
    // Mock image compression
    const compressedUri = `${uri}?compressed=true&quality=${quality}`;
    await this.simulateImageProcessing(compressedUri);
    return compressedUri;
  }

  /**
   * Get image dimensions
   */
  async getImageDimensions(uri: string): Promise<{ width: number; height: number }> {
    // Mock dimension calculation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Return mock dimensions
    return {
      width: Math.floor(Math.random() * 800) + 200, // 200-1000px
      height: Math.floor(Math.random() * 600) + 200, // 200-800px
    };
  }
}

// Global image optimizer instance
let globalImageOptimizer: ImageOptimizer | null = null;

export const useImageOptimization = (
  config: Partial<ImageConfig> = {}
): ImageState & ImageOperations => {
  // State management
  const [imageState, setImageState] = useState<ImageState>({
    loading: false,
    loaded: false,
    error: null,
    progress: 0,
    dimensions: null,
    optimizedUri: null,
    cacheHit: false,
  });

  // Initialize global optimizer
  useEffect(() => {
    if (!globalImageOptimizer) {
      globalImageOptimizer = new ImageOptimizer(config);
    }
  }, []);

  // Image operations
  const loadImage = useCallback(async (uri: string, customConfig?: Partial<ImageConfig>): Promise<string> => {
    if (!globalImageOptimizer) {
      throw new Error('Image optimizer not initialized');
    }

    setImageState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const optimizedUri = await globalImageOptimizer.loadImage(uri, customConfig);
      
      setImageState(prev => ({
        ...prev,
        loading: false,
        loaded: true,
        optimizedUri,
        cacheHit: globalImageOptimizer!.getCachedImage(uri) !== null,
      }));

      return optimizedUri;
    } catch (error) {
      setImageState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Image loading failed',
      }));
      throw error;
    }
  }, []);

  const preloadImages = useCallback(async (uris: string[]): Promise<void> => {
    if (!globalImageOptimizer) return;
    return globalImageOptimizer.preloadImages(uris);
  }, []);

  const clearCache = useCallback((): void => {
    if (globalImageOptimizer) {
      globalImageOptimizer.clearCache();
    }
  }, []);

  const getCacheStats = useCallback((): ImageCacheStats => {
    if (!globalImageOptimizer) {
      return {
        totalImages: 0,
        cacheSize: 0,
        hitRate: 0,
        missRate: 0,
        lastClearTime: Date.now(),
      };
    }
    return globalImageOptimizer.getCacheStats();
  }, []);

  const optimizeForNetworkType = useCallback((networkType: string): void => {
    if (globalImageOptimizer) {
      globalImageOptimizer.optimizeForNetworkType(networkType);
    }
  }, []);

  const generateThumbnail = useCallback(async (uri: string, size: number): Promise<string> => {
    if (!globalImageOptimizer) {
      throw new Error('Image optimizer not initialized');
    }
    return globalImageOptimizer.generateThumbnail(uri, size);
  }, []);

  const compressImage = useCallback(async (uri: string, quality: number): Promise<string> => {
    if (!globalImageOptimizer) {
      throw new Error('Image optimizer not initialized');
    }
    return globalImageOptimizer.compressImage(uri, quality);
  }, []);

  const getImageDimensions = useCallback(async (uri: string): Promise<{ width: number; height: number }> => {
    if (!globalImageOptimizer) {
      throw new Error('Image optimizer not initialized');
    }

    try {
      const dimensions = await globalImageOptimizer.getImageDimensions(uri);
      setImageState(prev => ({ ...prev, dimensions }));
      return dimensions;
    } catch (error) {
      console.error('Error getting image dimensions:', error);
      throw error;
    }
  }, []);

  return {
    // State
    ...imageState,

    // Operations
    loadImage,
    preloadImages,
    clearCache,
    getCacheStats,
    optimizeForNetworkType,
    generateThumbnail,
    compressImage,
    getImageDimensions,
  };
};