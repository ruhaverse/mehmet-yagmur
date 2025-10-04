// Jest setup file

// Mock the window object to avoid redefinition errors
if (typeof global.window === 'undefined') {
  Object.defineProperty(global, 'window', {
    value: {},
    writable: true,
  });
}