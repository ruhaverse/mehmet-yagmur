/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App, { AppContent } from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

test('renders AppContent correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<AppContent />);
  });
});
