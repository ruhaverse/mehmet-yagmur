import { describe, it, expect } from 'vitest';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App.js';

describe('App Component', () => {
  it('renders correctly', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer | null = null;
    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<App />);
    });
    expect(tree?.toJSON?.()).toMatchSnapshot();
  });
});
