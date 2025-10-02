module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  transform: {
    '^.+\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-gesture-handler|@babel|react-native/jest|react-native-web|react-native-config|react-test-renderer|@expo|expo|react-native-vector-icons|@react-navigation)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      babelConfig: '<rootDir>/babel.config.js',
    },
  },
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
