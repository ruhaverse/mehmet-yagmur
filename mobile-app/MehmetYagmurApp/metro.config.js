// Metro Configuration for ShareUpTime
// Optimized build configuration for production deployment

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 */
const config = {
  resolver: {
    // Enable TypeScript support
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
    
    // Asset extensions for media optimization
    assetExts: [
      'bmp', 'gif', 'jpg', 'jpeg', 'png', 'psd', 'svg', 'webp', 'm4v', 'mov',
      'mp4', 'mpeg', 'mpg', 'webm', 'aac', 'aiff', 'caf', 'm4a', 'mp3', 'wav',
      'html', 'pdf', 'yaml', 'yml', 'otf', 'ttf', 'zip'
    ],
    
    // Alias for easier imports
    alias: {
      '@components': path.resolve(__dirname, 'components'),
      '@screens': path.resolve(__dirname, 'screens'),
      '@services': path.resolve(__dirname, 'services'),
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@store': path.resolve(__dirname, 'store'),
      '@types': path.resolve(__dirname, 'types'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@assets': path.resolve(__dirname, 'assets'),
    },
  },
  
  transformer: {
    // Enable TypeScript transformation
    babelTransformerPath: require.resolve('react-native-typescript-transformer'),
    
    // SVG support
    svgAssetPlugin: {
      hermesParser: true,
      throwIfNamespace: false,
    },
    
    // Image optimization
    assetPlugins: ['react-native-svg-asset-plugin'],
    
    // Code minification for production
    minifierConfig: {
      mangle: {
        keep_fnames: true,
      },
      output: {
        ascii_only: true,
        quote_style: 3,
        wrap_iife: true,
      },
      sourceMap: {
        includeSources: false,
      },
      toplevel: false,
      warnings: false,
    },
  },
  
  serializer: {
    // Bundle optimization
    createModuleIdFactory: function () {
      return function (path) {
        // Use shorter module IDs for smaller bundle
        const projectRootPath = __dirname;
        const relativePath = path.replace(projectRootPath, '');
        return relativePath.replace(/\//g, '_').replace(/\./g, '_');
      };
    },
    
    // Code splitting configuration
    processModuleFilter: function (module) {
      // Exclude test files from production bundle
      if (module.path.includes('__tests__') || 
          module.path.includes('.test.') || 
          module.path.includes('.spec.')) {
        return false;
      }
      return true;
    },
  },
  
  server: {
    // Development server configuration
    port: 8081,
    enableVisualizer: false,
  },
  
  // Performance optimizations
  cacheStores: [
    {
      name: 'filesystem',
      type: 'FileStore',
      root: path.join(__dirname, '.metro-cache'),
    },
  ],
  
  // Watch configuration
  watchFolders: [
    path.resolve(__dirname, '../node_modules'),
    path.resolve(__dirname, './'),
  ],
  
  // Reset cache configuration
  resetCache: false,
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);