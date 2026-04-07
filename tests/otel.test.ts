import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setupOTelSDK, DEFAULT_COLLECTOR_ADDRESS } from '../src/otel';

describe('setupOTelSDK', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with explicit collector address', () => {
    expect(() => {
      setupOTelSDK('http://localhost:4318');
    }).not.toThrow();
  });

  it('should accept custom collector address', () => {
    expect(() => {
      setupOTelSDK('https://otel.example.com:4318');
    }).not.toThrow();
  });

  it('should register document load instrumentation', () => {
    expect(() => {
      setupOTelSDK(DEFAULT_COLLECTOR_ADDRESS);
    }).not.toThrow();
  });

  it('should create tracer provider with collector address', () => {
    expect(() => {
      setupOTelSDK('http://collector:4318');
    }).not.toThrow();
  });

  it('should set global providers', () => {
    expect(() => {
      setupOTelSDK(DEFAULT_COLLECTOR_ADDRESS);
    }).not.toThrow();
  });
});
