import { describe, it, expect } from 'vitest';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App.js';

describe('App Component', () => {
  it('renders correctly', async () => {
    const tree = ReactTestRenderer.create(<App />); // Ensure 'tree' is properly initialized
    expect(tree?.toJSON?.()).toMatchSnapshot();
  });
});
