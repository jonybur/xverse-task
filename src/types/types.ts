export interface Inscription {
  id: string;
  content_type: string;
  offset: number;
}

export interface UTXO {
  txid: string;
  vout: number;
  value: number;
  inscriptions: Inscription[];
}

export interface UTXOResponse {
  limit: number;
  offset: number;
  total: number;
  results: UTXO[];
}

export interface InscriptionDetails {
  id: string;
  number: number;
  content_type: string;
  content_length: number;
  genesis_timestamp: number;
  genesis_address: string;
  collection_name: string | null;
  mime_type: string;
} 