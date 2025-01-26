import axios from 'axios';
import { getAddressOrdinals, getInscriptionDetails } from '../api';
import { UTXOResponse, InscriptionDetails } from '../../types/types';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAddressOrdinals', () => {
    const mockResponse: UTXOResponse = {
      limit: 30,
      offset: 0,
      total: 0,
      results: []
    };

    it('should fetch ordinals for an address with default parameters', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await getAddressOrdinals('test-address');
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api-3.xverse.app/v1/address/test-address/ordinal-utxo?offset=0&limit=30'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch ordinals with custom offset and limit', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await getAddressOrdinals('test-address', 10, 20);
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api-3.xverse.app/v1/address/test-address/ordinal-utxo?offset=10&limit=20'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);
      
      await expect(getAddressOrdinals('test-address')).rejects.toThrow('Network error');
    });
  });

  describe('getInscriptionDetails', () => {
    const mockInscriptionDetails: InscriptionDetails = {
      id: 'test-id',
      number: 1,
      address: 'test-address',
      genesis_address: 'test-genesis-address',
      genesis_block_height: 1,
      genesis_block_hash: 'test-block-hash',
      genesis_tx_id: 'test-tx-id',
      genesis_fee: 1000,
      genesis_timestamp: 1704067200,
      location: 'test-location',
      output: 'test-output',
      offset: 0,
      sat_ordinal: 1,
      sat_rarity: 'common',
      sat_coinbase_height: 1,
      mime_type: 'text/plain',
      content_type: 'text/plain',
      content_length: 100,
      tx_id: 'test-tx',
      timestamp: 1704067200,
      value: 1000,
      category: null,
      collection_id: null,
      collection_name: null,
      inscription_floor_price: 0
    };

    it('should fetch inscription details', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockInscriptionDetails });
      
      const result = await getInscriptionDetails('test-address', 'test-inscription');
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api-3.xverse.app/v1/address/test-address/ordinals/inscriptions/test-inscription'
      );
      expect(result).toEqual(mockInscriptionDetails);
    });

    it('should handle API errors', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);
      
      await expect(getInscriptionDetails('test-address', 'test-inscription')).rejects.toThrow('Network error');
    });
  });
}); 