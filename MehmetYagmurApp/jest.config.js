module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!react-native|@react-native|react-native-vector-icons|@react-navigation)',
  ],
};
