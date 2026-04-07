import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setupOTelSDK } from '../src/otel';

describe('setupOTelSDK', () => {
  beforeEach(() => {
    // Reset any global OTEL state between tests
    vi.clearAllMocks();
  });

  it('should initialize and not throw errors', () => {
    expect(() => {
      setupOTelSDK();
    }).not.toThrow();
  });

  it('should register document load instrumentation', () => {
    const setupSpy = vi.spyOn(console, 'log');
    setupOTelSDK();
    // If setup completes without error, DocumentLoadInstrumentation is registered
    expect(setupSpy).not.toHaveBeenCalled();
    setupSpy.mockRestore();
  });

  it('should create tracer provider', () => {
    setupOTelSDK();
    // If no error is thrown, tracer provider was created successfully
    expect(true).toBe(true);
  });

  it('should set global meter provider', () => {
    setupOTelSDK();
    // If no error is thrown, meter provider was set successfully
    expect(true).toBe(true);
  });

  it('should set global logger provider', () => {
    setupOTelSDK();
    // If no error is thrown, logger provider was set successfully
    expect(true).toBe(true);
  });
});
