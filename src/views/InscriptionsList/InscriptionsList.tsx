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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const loadingRef = useRef(false);
  const offsetRef = useRef(0);
  const { cachedInscriptions, setCachedInscriptions } = useInscriptions();

  const loadInscriptions = useCallback(async (isInitialLoad: boolean = false) => {
    if (!address || loadingRef.current) {
      return;
    }

    // Check cache first
    if (isInitialLoad && cachedInscriptions[address]) {
      const cachedResults = cachedInscriptions[address].utxos;
      setUtxos(cachedResults);
      offsetRef.current = cachedResults.length;
      setHasMore(cachedResults.length < cachedInscriptions[address].total);
      return;
    }
    
    loadingRef.current = true;
    setLoading(true);
    
    try {
      console.log('Current offset:', offsetRef.current);
      const response = await getAddressOrdinals(address, offsetRef.current);
      const newResults = response.results;
      console.log('Response:', {
        total: response.total,
        resultsLength: newResults.length,
        results: newResults,
        utxosWithInscriptions: newResults.filter(utxo => utxo.inscriptions?.length > 0).length
      });
      
      // Filter out UTXOs without inscriptions
      const utxosWithInscriptions = newResults.filter(utxo => utxo.inscriptions?.length > 0);
      
      if (utxosWithInscriptions.length === 0 && !isInitialLoad) {
        // If no new inscriptions found and not initial load, try next batch
        offsetRef.current += newResults.length;
        setHasMore(offsetRef.current < response.total);
        loadingRef.current = false;
        setLoading(false);
        
        // Immediately trigger next load if we have more to load
        if (offsetRef.current < response.total) {
          loadInscriptions(false);
        }
        return;
      }
      
      if (isInitialLoad) {
        setUtxos(utxosWithInscriptions);
        // Cache initial results
        setCachedInscriptions(address, { 
          utxos: utxosWithInscriptions, 
          total: response.total 
        });
      } else {
        setUtxos(prev => [...prev, ...utxosWithInscriptions]);
      }
      
      offsetRef.current += newResults.length;
      console.log('New offset:', offsetRef.current);
      setHasMore(offsetRef.current < response.total);
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load inscriptions';
      setError(message);
      if (isInitialLoad) {
        setUtxos([]);
        offsetRef.current = 0;
      }
      console.error('Failed to load inscriptions:', message);
    }
    
    setLoading(false);
    loadingRef.current = false;
  }, [address, cachedInscriptions, setCachedInscriptions]);

  useEffect(() => {
    if (error) return;
    loadInscriptions(true);
  }, [loadInscriptions, error]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadInscriptions(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    offsetRef.current = 0;
    setHasMore(true);
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
    (utxo.inscriptions || []).map(inscription => ({
      id: inscription.id,
      text: `Inscription ${inscription.id.slice(0, 8)}`
    }))
  );

  const hasInscriptions = inscriptionsList.length > 0;

  return (
    <div className={styles.container}>
      <AddressSearch />
      {error ? (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleRetry}>Try Again</button>
          <button onClick={handleBack}>Back to Search</button>
        </div>
      ) : (
        <div className={styles.content}>
          <Title variant="small">Results</Title>
          <div className={styles.listContainer}>
            {hasInscriptions ? (
              <>
                <List 
                  items={inscriptionsList.map(i => i.text)}
                  onItemClick={handleInscriptionClick}
                />
                <div className={styles.loadMoreContainer}>
                  {hasMore && (
                    <Button 
                      onClick={handleLoadMore} 
                      className={styles.loadMoreButton}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </Button>
                  )}
                </div>
              </>
            ) : loading ? (
              <p>Loading...</p>
            ) : (
              <p>No inscriptions found for this address.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 