import { createContext } from 'react';
import { UTXO } from '../types/types';

export interface InscriptionsContextType {
  cachedInscriptions: Record<string, { utxos: UTXO[], total: number }>;
  setCachedInscriptions: (address: string, data: { utxos: UTXO[], total: number }) => void;
  clearCache: () => void;
}

export const InscriptionsContext = createContext<InscriptionsContextType | undefined>(undefined); 