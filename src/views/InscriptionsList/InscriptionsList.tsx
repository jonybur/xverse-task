import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAddressOrdinals } from '../../services/api';
import { UTXO } from '../../types/types';
import { AddressSearch } from '../AddressSearch';
import { Title, List, Button } from '../../components';
import { useInscriptions } from '../../context/hooks';
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
  const { cachedInscriptions, setCachedInscriptions } = useInscriptions();

  const loadInscriptions = useCallback(async () => {
    if (!address || loadingRef.current) {
      return;
    }

    // Check cache first
    if (offset === 0 && cachedInscriptions[address]) {
      setUtxos(cachedInscriptions[address].utxos);
      setTotal(cachedInscriptions[address].total);
      return;
    }
    
    loadingRef.current = true;
    setLoading(true);
    
    try {
      const response = await getAddressOrdinals(address, offset);
      const newUtxos = offset === 0 ? response.results : [...utxos, ...response.results];
      setUtxos(newUtxos);
      setTotal(response.total);
      setError(null);

      // Cache only the initial load
      if (offset === 0) {
        setCachedInscriptions(address, { utxos: newUtxos, total: response.total });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load inscriptions';
      setError(message);
      setUtxos([]);
      setTotal(0);
      console.error('Failed to load inscriptions:', message);
    }
    
    setLoading(false);
    loadingRef.current = false;
  }, [address, offset, cachedInscriptions, setCachedInscriptions, utxos]);

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