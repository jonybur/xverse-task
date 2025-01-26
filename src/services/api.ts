import axios from 'axios';
import { UTXOResponse, InscriptionDetails } from '../types/types';

const BASE_URL = 'https://api-3.xverse.app/v1';

export const getAddressOrdinals = async (address: string, offset: number = 0, limit: number = 30): Promise<UTXOResponse> => {
  const response = await axios.get(`${BASE_URL}/address/${address}/ordinal-utxo?offset=${offset}&limit=${limit}`);
  return response.data;
};

export const getInscriptionDetails = async (address: string, inscriptionId: string): Promise<InscriptionDetails> => {
  const response = await axios.get(`${BASE_URL}/address/${address}/ordinals/inscriptions/${inscriptionId}`);
  return response.data;
}; 