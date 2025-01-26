import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAddressOrdinals } from '../../services/api';
import { UTXO } from '../../types/types';
import { AddressSearch } from '../AddressSearch';
import { Title, List } from '../../components';
import { useInscriptions } from '../../context/hooks';
import styles from './InscriptionsList.module.scss';

export const InscriptionsList: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const [utxos, setUtxos] = useState<UTXO[]>([]);
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
    if (cachedInscriptions[address]) {
      setUtxos(cachedInscriptions[address].utxos);
      return;
    }
    
    loadingRef.current = true;
    setLoading(true);
    
    try {
      // Load all UTXOs recursively
      let allUtxos: UTXO[] = [];
      let offset = 0;
      let total = 0;
      
      do {
        const response = await getAddressOrdinals(address, offset);
        allUtxos = [...allUtxos, ...response.results];
        total = response.total;
        offset += response.results.length;
      } while (offset < total);

      setUtxos(allUtxos);
      setError(null);

      // Cache the results
      setCachedInscriptions(address, { utxos: allUtxos, total });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load inscriptions';
      setError(message);
      setUtxos([]);
      console.error('Failed to load inscriptions:', message);
    }
    
    setLoading(false);
    loadingRef.current = false;
  }, [address, cachedInscriptions, setCachedInscriptions]);

  useEffect(() => {
    if (error) return;
    loadInscriptions();
  }, [loadInscriptions, error]);

  const handleRetry = () => {
    setError(null);
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
            {loading ? (
              <p>Loading...</p>
            ) : hasInscriptions ? (
              <List 
                items={inscriptionsList.map(i => i.text)}
                onItemClick={handleInscriptionClick}
              />
            ) : (
              <p>No inscriptions found for this address.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 