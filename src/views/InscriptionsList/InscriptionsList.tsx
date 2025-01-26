import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAddressOrdinals } from '../../services/api';
import { UTXO } from '../../types/types';
import { AddressSearch } from '../AddressSearch';

export const InscriptionsList: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const [utxos, setUtxos] = useState<UTXO[]>([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const loadingRef = useRef(false);

  const loadInscriptions = useCallback(async () => {
    if (!address || loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    try {
      const response = await getAddressOrdinals(address, offset);
      setUtxos(prev => offset === 0 ? response.results : [...prev, ...response.results]);
      setTotal(response.total);
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load inscriptions';
      setError(message);
      setUtxos([]);
      setTotal(0);
    }
    setLoading(false);
    loadingRef.current = false;
  }, [address, offset]);

  useEffect(() => {
    if (error) return;
    loadInscriptions();
  }, [loadInscriptions, error]);

  const handleLoadMore = () => {
    setOffset(prev => prev + 30);
  };

  const handleRetry = () => {
    setError(null);
    setOffset(0);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <AddressSearch />
      </div>
      
      {error ? (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleRetry}>Try Again</button>
          <button onClick={handleBack}>Back to Search</button>
        </div>
      ) : (
        <>
          <h2>Results</h2>
          <div>
            {utxos.map(utxo => (
              utxo.inscriptions.map(inscription => (
                <div key={inscription.id}>
                  <Link to={`/inscription/${address}/${inscription.id}`}>
                    <p>Inscription {inscription.id}</p>
                  </Link>
                </div>
              ))
            ))}
          </div>
          {utxos.length < total && !loading && (
            <button onClick={handleLoadMore}>Load More</button>
          )}
          {loading && <p>Loading...</p>}
        </>
      )}
    </div>
  );
}; 