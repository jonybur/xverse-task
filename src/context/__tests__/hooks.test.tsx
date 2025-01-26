import React from 'react';
import { renderHook } from '@testing-library/react';
import { useInscriptions } from '../hooks';
import { InscriptionsContext, InscriptionsContextType } from '../context';

describe('useInscriptions', () => {
  const mockContextValue: InscriptionsContextType = {
    cachedInscriptions: {},
    setCachedInscriptions: jest.fn(),
    clearCache: jest.fn()
  };

  it('should throw error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useInscriptions())).toThrow('useInscriptions must be used within an InscriptionsProvider');
    consoleError.mockRestore();
  });

  it('should return context when used within provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <InscriptionsContext.Provider value={mockContextValue}>
        {children}
      </InscriptionsContext.Provider>
    );

    const { result } = renderHook(() => useInscriptions(), { wrapper });
    expect(result.current).toBe(mockContextValue);
  });
}); 