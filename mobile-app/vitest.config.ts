import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['__tests__/**/*.test.{js,jsx,ts,tsx}'],
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
    },
  },
});