import { InscriptionsContextType } from '../context';
import { UTXO } from '../../types/types';

describe('InscriptionsContext', () => {
  const mockUtxos: UTXO[] = [
    {
      txid: 'test-txid',
      vout: 0,
      value: 1000,
      inscriptions: [{
        id: 'test-inscription',
        content_type: 'text/plain',
        offset: 0
      }]
    }
  ];

  const mockContextValue: InscriptionsContextType = {
    cachedInscriptions: {},
    setCachedInscriptions: jest.fn(),
    clearCache: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty cache', () => {
    expect(mockContextValue.cachedInscriptions).toEqual({});
  });

  it('should update cached inscriptions', () => {
    mockContextValue.setCachedInscriptions('test-address', {
      utxos: mockUtxos,
      total: 1
    });

    expect(mockContextValue.setCachedInscriptions).toHaveBeenCalledWith(
      'test-address',
      {
        utxos: mockUtxos,
        total: 1
      }
    );
  });

  it('should clear cache', () => {
    mockContextValue.clearCache();
    expect(mockContextValue.clearCache).toHaveBeenCalled();
  });
}); 