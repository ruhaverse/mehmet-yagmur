import { jest } from '@jest/globals';

test('Sample Test', () => {
  expect(true).toBe(true);
});

test('Mock Function Test', () => {
  const mockFn = jest.fn().mockReturnValue('Hello, World!');
  expect(mockFn()).toBe('Hello, World!');
  expect(mockFn).toHaveBeenCalledTimes(1);
});

test('Async Function Test', async () => {
  const asyncFn = jest.fn().mockResolvedValue('Async Result');
  const result = await asyncFn();
  expect(result).toBe('Async Result');
  expect(asyncFn).toHaveBeenCalledTimes(1);
});
