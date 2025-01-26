import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInscriptionDetails } from "../../services/api";
import { InscriptionDetails as IInscriptionDetails } from "../../types/types";
import { Title, Field } from "../../components";
import styles from './InscriptionDetails.module.scss';

const isValueEmpty = (value: string | number | null | undefined): boolean => {
  return value === null || value === undefined || value === '';
};

const toString = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

export const InscriptionDetails: React.FC = () => {
  const { address, inscriptionId } = useParams<{
    address: string;
    inscriptionId: string;
  }>();
  const [details, setDetails] = useState<IInscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      if (!address || !inscriptionId) return;

      try {
        const response = await getInscriptionDetails(address, inscriptionId);
        setDetails(response);
      } catch (error) {
        console.error("Error loading inscription details:", error);
      }
      setLoading(false);
    };

    loadDetails();
  }, [address, inscriptionId]);

  if (loading) return <div>Loading...</div>;
  if (!details || !address) return <div>No details found</div>;

  const contentUrl = `https://ord.xverse.app/content/${inscriptionId}`;

  return (
    <div>
      {details.content_type && (
        details.content_type.startsWith("image/svg") ? (
          <iframe src={contentUrl} title="Inscription content" className={styles.contentImage} />
        ) : details.content_type.startsWith("image/") ? (
          <img src={contentUrl} alt="Inscription content" className={styles.contentImage} />
        ) : (
          <iframe src={contentUrl} title="Inscription content" className={styles.contentImage} />
        )
      )}
      <Title variant="title">Inscription {inscriptionId?.slice(0, 8)}</Title>
      
      <div className={styles.fields}>
        <Field 
          title="Inscription ID" 
          value={toString(details.id)} 
          variant="primary"
        />
        <Field 
          title="Owner Address" 
          value={toString(address)} 
          variant="primary"
        />
      </div>
      <div className={styles.fields}>
        <Title variant="subtitle">Attributes</Title>
        {!isValueEmpty(details.content_type) && (
          <Field 
            title="Content Type" 
            value={toString(details.content_type)} 
            variant="secondary"
          />
        )}
        {!isValueEmpty(details.content_length) && (
          <Field 
            title="Content Length" 
            value={`${toString(details.content_length)} bytes`} 
            variant="secondary"
          />
        )}
        {!isValueEmpty(details.mime_type) && (
          <Field 
            title="MIME Type" 
            value={toString(details.mime_type)} 
            variant="secondary"
          />
        )}

        {!isValueEmpty(details.collection_name) && (
          <>
            <Field 
              title="Collection" 
              value={toString(details.collection_name)} 
              variant="secondary"
            />
            {!isValueEmpty(details.collection_id) && (
              <Field 
                title="Collection ID" 
                value={toString(details.collection_id)} 
                variant="secondary"
              />
            )}
            {!isValueEmpty(details.inscription_floor_price) && (
              <Field 
                title="Floor Price" 
                value={`${toString(details.inscription_floor_price)} BTC`} 
                variant="secondary"
              />
            )}
          </>
        )}

        {!isValueEmpty(details.genesis_address) && (
          <Field 
            title="Genesis Address" 
            value={toString(details.genesis_address)} 
            variant="secondary"
          />
        )}
        {!isValueEmpty(details.genesis_block_height) && (
          <Field 
            title="Genesis Block" 
            value={toString(details.genesis_block_height)} 
            variant="secondary"
          />
        )}
        {!isValueEmpty(details.genesis_block_hash) && (
          <Field 
            title="Genesis Block Hash" 
            value={toString(details.genesis_block_hash)} 
            variant="secondary"
          />
        )}
        {!isValueEmpty(details.genesis_fee) && (
          <Field 
            title="Genesis Fee" 
            value={`${toString(details.genesis_fee)} sats`} 
            variant="secondary"
          />
        )}
        {!isValueEmpty(details.genesis_timestamp) && (
          <Field 
            title="Genesis Date" 
            value={new Date(details.genesis_timestamp).toLocaleString()} 
            variant="secondary"
          />
        )}

        {!isValueEmpty(details.sat_ordinal) && (
          <Field 
            title="Sat Ordinal" 
            value={toString(details.sat_ordinal)} 
            variant="secondary"
          />
        )}
        {!isValueEmpty(details.sat_rarity) && (
          <Field 
            title="Sat Rarity" 
            value={toString(details.sat_rarity)} 
            variant="secondary"
          />
        )}
        {!isValueEmpty(details.sat_coinbase_height) && (
          <Field 
            title="Sat Coinbase Height" 
            value={toString(details.sat_coinbase_height)} 
            variant="secondary"
          />
        )}

        {!isValueEmpty(details.location) && (
          <Field 
            title="Location" 
            value={toString(details.location)} 
            variant="secondary"
          />
        )}
        {!isValueEmpty(details.output) && (
          <Field 
            title="Output" 
            value={toString(details.output)} 
            variant="secondary"
          />
        )}
        {!isValueEmpty(details.tx_id) && (
          <Field 
            title="Transaction ID" 
            value={toString(details.tx_id)} 
            variant="secondary"
          />
        )}
        {!isValueEmpty(details.value) && (
          <Field 
            title="Value" 
            value={`${toString(details.value)} sats`} 
            variant="secondary"
          />
        )}
        {!isValueEmpty(details.timestamp) && (
          <Field 
            title="Date" 
            value={new Date(details.timestamp).toLocaleString()} 
            variant="secondary"
          />
        )}
      </div>
    </div>
  );
};
