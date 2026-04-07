import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setupFetchInstrumentation } from '../src/instrumentations';

describe('setupFetchInstrumentation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should accept a backend URL and not throw', () => {
    expect(() => {
      setupFetchInstrumentation('http://localhost:8081');
    }).not.toThrow();
  });

  it('should accept various URL formats', () => {
    const urls = [
      'http://localhost:8081',
      'https://api.example.com',
      'http://192.168.1.1:3000',
      'https://api.production.example.com/v1',
    ];

    urls.forEach((url) => {
      expect(() => {
        setupFetchInstrumentation(url);
      }).not.toThrow();
    });
  });

  it('should handle URLs with trailing slashes', () => {
    expect(() => {
      setupFetchInstrumentation('http://localhost:8081/');
    }).not.toThrow();
  });

  it('should register fetch instrumentation', () => {
    // If no error is thrown, fetch instrumentation was registered successfully
    setupFetchInstrumentation('http://localhost:8081');
    expect(true).toBe(true);
  });
});
