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

  const loadInscriptions = useCallback(
    async (isInitialLoad: boolean = false) => {
      if (!address || loadingRef.current) {
        return;
      }

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
        const response = await getAddressOrdinals(address, offsetRef.current);
        const newResults = response.results;
        const utxosWithInscriptions = newResults.filter(utxo => utxo.inscriptions?.length > 0);

        if (utxosWithInscriptions.length === 0 && !isInitialLoad) {
          offsetRef.current += newResults.length;
          setHasMore(offsetRef.current < response.total);
          loadingRef.current = false;
          setLoading(false);

          if (offsetRef.current < response.total) {
            loadInscriptions(false);
          }
          return;
        }

        if (isInitialLoad) {
          setUtxos(utxosWithInscriptions);
          setCachedInscriptions(address, {
            utxos: utxosWithInscriptions,
            total: response.total,
          });
        } else {
          setUtxos(prev => [...prev, ...utxosWithInscriptions]);
        }

        offsetRef.current += newResults.length;
        setHasMore(offsetRef.current < response.total);
        setError(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load inscriptions';
        setError(message);
        if (isInitialLoad) {
          setUtxos([]);
          offsetRef.current = 0;
        }
      }

      setLoading(false);
      loadingRef.current = false;
    },
    [address, cachedInscriptions, setCachedInscriptions]
  );

  useEffect(() => {
    setError(null);
    offsetRef.current = 0;
    setUtxos([]);
    loadInscriptions(true);
  }, [address, loadInscriptions]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadInscriptions(false);
    }
  };

  const handleInscriptionClick = (index: number) => {
    const inscription = inscriptionsList[index];
    navigate(`/inscription/${address}/${inscription.id}`);
  };

  const inscriptionsList = utxos.flatMap(utxo =>
    (utxo.inscriptions || []).map(inscription => ({
      id: inscription.id,
      text: `Inscription ${inscription.id.slice(0, 8)}`,
    }))
  );

  const hasInscriptions = inscriptionsList.length > 0;

  return (
    <div className={styles.container}>
      <AddressSearch />
      {error ? (
        <div>
          <Title variant="small">Error loading inscriptions</Title>
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
