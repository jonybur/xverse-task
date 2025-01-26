import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAddressOrdinals } from '../services/api';
import { UTXO } from '../types/types';

export const InscriptionsList: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const [utxos, setUtxos] = useState<UTXO[]>([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadInscriptions = async () => {
    if (!address || loading) return;
    
    setLoading(true);
    try {
      const response = await getAddressOrdinals(address, offset);
      setUtxos(prev => [...prev, ...response.results]);
      setTotal(response.total);
    } catch (error) {
      console.error('Error loading inscriptions:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInscriptions();
  }, [address, offset]);

  const handleLoadMore = () => {
    setOffset(prev => prev + 30);
  };

  return (
    <div>
      <h2>Inscriptions for {address}</h2>
      <div>
        {utxos.map(utxo => (
          utxo.inscriptions.map(inscription => (
            <div key={inscription.id}>
              <Link to={`/inscription/${address}/${inscription.id}`}>
                <p>Inscription ID: {inscription.id}</p>
                <p>Content Type: {inscription.content_type}</p>
              </Link>
            </div>
          ))
        ))}
      </div>
      {utxos.length < total && !loading && (
        <button onClick={handleLoadMore}>Load More</button>
      )}
      {loading && <p>Loading...</p>}
    </div>
  );
}; 