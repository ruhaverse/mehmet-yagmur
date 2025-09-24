module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '/workspaces/mehmet-yagmur/shareuptime-social/backend/auth-service/tsconfig.json' }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  roots: ['<rootDir>/shareuptime-social/backend/auth-service/test'],
};