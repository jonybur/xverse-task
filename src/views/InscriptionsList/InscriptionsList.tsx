import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAddressOrdinals } from '../../services/api';
import { UTXO } from '../../types/types';
import { AddressSearch } from '../AddressSearch';
import { Title, List, Button } from '../../components';
import styles from './InscriptionsList.module.scss';

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
    if (!address || loadingRef.current) {
      return;
    }
    
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
      console.error('Failed to load inscriptions:', message);
    }
    
    setLoading(false);
    loadingRef.current = false;
  }, [address, offset]);

  useEffect(() => {
    if (error) return;
    loadInscriptions();
  }, [loadInscriptions, error]);

  const handleLoadMore = () => {
    if (!loading) {
      setOffset(prev => prev + 30);
    }
  };

  const handleRetry = () => {
    setError(null);
    setOffset(0);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleInscriptionClick = (index: number) => {
    const inscription = inscriptionsList[index];
    navigate(`/inscription/${address}/${inscription.id}`);
  };

  // Flatten UTXO inscriptions into a single list
  const inscriptionsList = utxos.flatMap(utxo => 
    utxo.inscriptions.map(inscription => ({
      id: inscription.id,
      text: `Inscription ${inscription.id.slice(0, 8)}`
    }))
  );

  const canLoadMore = !loading && utxos.length < total;

  return (
    <div>
      <AddressSearch />
      {error ? (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleRetry}>Try Again</button>
          <button onClick={handleBack}>Back to Search</button>
        </div>
      ) : (
        <>
          <Title variant="small">Results</Title>
          <List 
            items={inscriptionsList.map(i => i.text)}
            onItemClick={handleInscriptionClick}
          />
          {canLoadMore && (
            <Button onClick={handleLoadMore} className={styles.loadMoreButton}>
              Load More
            </Button>
          )}
          {loading && <p>Loading...</p>}
        </>
      )}
    </div>
  );
}; 