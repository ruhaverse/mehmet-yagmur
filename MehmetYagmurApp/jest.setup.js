// Jest setup file

// Extend Jest timeout if needed
jest.setTimeout(30000);

// Mock global objects or setup configurations if required
// Example: Mocking fetch API
global.fetch = require('jest-fetch-mock');

// Mock @react-native-community/netinfo
jest.mock('@react-native-community/netinfo', () => {
  return {
    useNetInfo: jest.fn(() => ({
      isConnected: true,
    })),
  };
});

// Mock react-native-toast-message
jest.mock('react-native-toast-message', () => {
  return {
    show: jest.fn(),
    hide: jest.fn(),
  };
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  return {
    GestureHandlerRootView: ({ children }) => children,
    Swipeable: jest.fn(),
    DrawerLayout: jest.fn(),
  };
});

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  return {
    ProgressBar: () => null,
    Colors: {},
  };
});

// Mock react-native-encrypted-storage
jest.mock('react-native-encrypted-storage', () => {
  return {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
});

// Mock react-native modules for Jest
global.__fbBatchedBridgeConfig = {};
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn(),
  constants: {
    forceTouchAvailable: false,
  },
}));

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Ensure window object is not redefined
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'window', {
    value: window,
    writable: false,
  });
}