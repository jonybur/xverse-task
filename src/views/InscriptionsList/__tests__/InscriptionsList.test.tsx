import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { InscriptionsList } from '../InscriptionsList';
import { getAddressOrdinals } from '../../../services/api';
import { InscriptionsProvider } from '../../../context/InscriptionsContext';
import { UTXO, UTXOResponse } from '../../../types/types';

// Mock the API module
jest.mock('../../../services/api');
const mockedGetAddressOrdinals = getAddressOrdinals as jest.MockedFunction<typeof getAddressOrdinals>;

// Add spy on the mock to track calls
beforeEach(() => {
  jest.clearAllMocks();
  mockedGetAddressOrdinals.mockImplementation(async () => {
    return Promise.resolve(createMockResponse([]));
  });
});

// Mock the hooks
const mockSetCachedInscriptions = jest.fn();
const mockCachedInscriptions = {};

jest.mock('../../../context/hooks', () => ({
  useInscriptions: () => ({
    cachedInscriptions: mockCachedInscriptions,
    setCachedInscriptions: mockSetCachedInscriptions,
  }),
}));

// Mock ResizeObserver
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock AutoSizer
jest.mock('react-virtualized', () => {
  const AutoSizer = ({
    children,
  }: {
    children: ({ width, height }: { width: number; height: number }) => React.ReactNode;
  }) => children({ width: 1000, height: 1000 });

  const List = ({
    rowRenderer,
    rowCount,
  }: {
    rowRenderer: (props: {
      index: number;
      key: string;
      style: React.CSSProperties;
    }) => React.ReactNode;
    rowCount: number;
  }) => {
    const items = [];
    for (let i = 0; i < rowCount; i++) {
      items.push(rowRenderer({ index: i, key: `row_${i}`, style: {} }));
    }
    return <div data-testid="virtualized-list">{items}</div>;
  };
  return { AutoSizer, List };
});

const mockUtxos: UTXO[] = [
  {
    txid: 'tx1',
    vout: 0,
    value: 1000,
    inscriptions: [{ id: 'inscription1', content_type: 'text/plain', offset: 0 }],
  },
];

const createMockResponse = (results: UTXO[], total?: number): UTXOResponse => ({
  limit: 20,
  offset: 0,
  total: total ?? results.length,
  results,
});

const renderComponent = () => {
  return render(
    <MemoryRouter initialEntries={['/testAddress']}>
      <InscriptionsProvider>
        <Routes>
          <Route path="/:address" element={<InscriptionsList />} />
        </Routes>
      </InscriptionsProvider>
    </MemoryRouter>
  );
};

describe('InscriptionsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads inscriptions on mount', async () => {
    const mockResponse = createMockResponse(mockUtxos);
    mockedGetAddressOrdinals.mockResolvedValueOnce(mockResponse);
    
    renderComponent();
    
    await waitFor(() => {
      expect(mockedGetAddressOrdinals).toHaveBeenCalledWith('testAddress', 0);
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(mockSetCachedInscriptions).toHaveBeenCalledWith('testAddress', {
        utxos: mockUtxos,
        total: mockResponse.total,
      });
    }, { timeout: 2000 });
  });

  it('handles empty results', async () => {
    const mockResponse = createMockResponse([]);
    mockedGetAddressOrdinals.mockResolvedValueOnce(mockResponse);
    
    renderComponent();
    
    await waitFor(() => {
      expect(mockedGetAddressOrdinals).toHaveBeenCalledWith('testAddress', 0);
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(mockSetCachedInscriptions).toHaveBeenCalledWith('testAddress', {
        utxos: [],
        total: 0,
      });
    }, { timeout: 2000 });
  });

  it('handles errors', async () => {
    const testError = new Error('Test error');
    mockedGetAddressOrdinals.mockRejectedValueOnce(testError);
    
    renderComponent();
    
    await waitFor(() => {
      expect(mockedGetAddressOrdinals).toHaveBeenCalledWith('testAddress', 0);
    }, { timeout: 2000 });
  });
});
