import React, { useState } from 'react';
import { InscriptionsContext, InscriptionsContextType } from './context';

export const InscriptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cachedInscriptions, setCachedInscriptionsState] = useState<InscriptionsContextType['cachedInscriptions']>({});

  const setCachedInscriptions: InscriptionsContextType['setCachedInscriptions'] = (address, data) => {
    setCachedInscriptionsState(prev => ({
      ...prev,
      [address]: data
    }));
  };

  const clearCache = () => {
    setCachedInscriptionsState({});
  };

  return (
    <InscriptionsContext.Provider value={{ cachedInscriptions, setCachedInscriptions, clearCache }}>
      {children}
    </InscriptionsContext.Provider>
  );
}; 