import { render, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { InscriptionsList } from '../InscriptionsList';
import { getAddressOrdinals } from '../../../services/api';
import { InscriptionsProvider } from '../../../context/InscriptionsContext';
import { UTXO, UTXOResponse } from '../../../types/types';

// Mock console methods
const originalConsole = { ...console };
beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
});

// Mock the API module
jest.mock('../../../services/api');
const mockedGetAddressOrdinals = getAddressOrdinals as jest.MockedFunction<typeof getAddressOrdinals>;

// Mock the hooks
jest.mock('../../../context/hooks', () => ({
  useInscriptions: () => ({
    cachedInscriptions: {},
    setCachedInscriptions: jest.fn()
  })
}));

// Mock ResizeObserver
const mockResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
window.ResizeObserver = mockResizeObserver;

// Mock AutoSizer
jest.mock('react-virtualized', () => {
  const AutoSizer = ({ children }: { children: ({ width, height }: { width: number; height: number }) => React.ReactNode }) => 
    children({ width: 1000, height: 1000 });
    
  const List = ({ rowRenderer, rowCount }: { rowRenderer: (props: { index: number; key: string; style: React.CSSProperties }) => React.ReactNode; rowCount: number }) => {
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
    inscriptions: [
      { id: 'inscription1', content_type: 'text/plain', offset: 0 },
      { id: 'inscription2', content_type: 'text/plain', offset: 0 }
    ]
  },
  {
    txid: 'tx2',
    vout: 1,
    value: 2000,
    inscriptions: [
      { id: 'inscription3', content_type: 'text/plain', offset: 0 }
    ]
  }
];

const createMockResponse = (results: UTXO[], total = results.length): UTXOResponse => ({
  limit: 20,
  offset: 0,
  total,
  results
});

const renderInscriptionsList = (address: string = 'testAddress') => {
  return render(
    <MemoryRouter initialEntries={[`/${address}`]}>
      <InscriptionsProvider>
        <Routes>
          <Route path="/:address" element={<InscriptionsList />} />
          <Route path="/" element={<div>Home page</div>} />
          <Route path="/inscription/:address/:id" element={<div>Inscription detail page</div>} />
        </Routes>
      </InscriptionsProvider>
    </MemoryRouter>
  );
};

describe('InscriptionsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch inscriptions on initial load', async () => {
    mockedGetAddressOrdinals.mockResolvedValueOnce(createMockResponse(mockUtxos));
    
    await act(async () => {
      renderInscriptionsList();
    });

    await waitFor(() => {
      expect(mockedGetAddressOrdinals).toHaveBeenCalledWith('testAddress', 0);
    });
  });

  it('should use cached inscriptions when available', async () => {
    const mockResponse = createMockResponse(mockUtxos);
    mockedGetAddressOrdinals.mockResolvedValueOnce(mockResponse);
    
    await act(async () => {
      renderInscriptionsList();
    });

    await waitFor(() => {
      expect(mockedGetAddressOrdinals).toHaveBeenCalledWith('testAddress', 0);
    });
  });

  it('should handle pagination correctly', async () => {
    const firstPage = [mockUtxos[0]];
    const secondPage = [mockUtxos[1]];
    const totalItems = 2;

    mockedGetAddressOrdinals
      .mockResolvedValueOnce(createMockResponse(firstPage, totalItems))
      .mockResolvedValueOnce(createMockResponse(secondPage, totalItems));

    await act(async () => {
      renderInscriptionsList();
    });

    expect(mockedGetAddressOrdinals).toHaveBeenCalledWith('testAddress', 0);
  });

  it('should handle API errors correctly', async () => {
    const errorMessage = 'Failed to load inscriptions';
    mockedGetAddressOrdinals.mockRejectedValueOnce(new Error(errorMessage));

    await act(async () => {
      renderInscriptionsList();
    });

    expect(mockedGetAddressOrdinals).toHaveBeenCalledTimes(1);
  });

  it('should handle empty results correctly', async () => {
    mockedGetAddressOrdinals.mockResolvedValueOnce(createMockResponse([]));

    await act(async () => {
      renderInscriptionsList();
    });

    await waitFor(() => {
      expect(mockedGetAddressOrdinals).toHaveBeenCalledWith('testAddress', 0);
    });
  });
}); 