import { useContext } from 'react';
import { InscriptionsContext } from './context';

export const useInscriptions = () => {
  const context = useContext(InscriptionsContext);
  if (context === undefined) {
    throw new Error('useInscriptions must be used within an InscriptionsProvider');
  }
  return context;
};
