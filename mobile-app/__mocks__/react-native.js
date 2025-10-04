// Mock for react-native

const ReactNative = jest.requireActual('react-native');

Object.defineProperty(global, 'window', {
  value: {},
  writable: true,
});

module.exports = {
  ...ReactNative,
  Platform: {
    ...ReactNative.Platform,
    OS: 'ios',
  },
  NativeModules: {
    ...ReactNative.NativeModules,
    PlatformConstants: {
      forceTouchAvailable: false,
    },
  },
  FlatList: (props) => {
    return React.createElement('FlatList', props, props.children);
  },
  VirtualizedList: (props) => {
    return React.createElement('VirtualizedList', props, props.children);
  },
};