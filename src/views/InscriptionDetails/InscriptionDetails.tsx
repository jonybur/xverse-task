import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInscriptionDetails } from "../../services/api";
import { InscriptionDetails as IInscriptionDetails } from "../../types/types";
import { Title, Field } from "../../components";
import styles from './InscriptionDetails.module.scss';

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
          value={details.id} 
          variant="primary"
        />
        <Field 
          title="Owner Address" 
          value={address} 
          variant="primary"
        />
      </div>
      <div className={styles.fields}>
        <Title variant="subtitle">Attributes</Title>
        <Field 
          title="Content Type" 
          value={details.content_type} 
          variant="secondary"
        />
        <Field 
          title="Content Length" 
          value={`${details.content_length} bytes`} 
          variant="secondary"
        />
        <Field 
          title="MIME Type" 
          value={details.mime_type} 
          variant="secondary"
        />

        {details.collection_name && (
          <>
            <Field 
              title="Collection" 
              value={details.collection_name} 
              variant="secondary"
            />
            <Field 
              title="Collection ID" 
              value={details.collection_id || ''} 
              variant="secondary"
            />
            <Field 
              title="Floor Price" 
              value={`${details.inscription_floor_price} BTC`} 
              variant="secondary"
            />
          </>
        )}

        <Field 
          title="Genesis Address" 
          value={details.genesis_address} 
          variant="secondary"
        />
        <Field 
          title="Genesis Block" 
          value={details.genesis_block_height.toString()} 
          variant="secondary"
        />
        <Field 
          title="Genesis Block Hash" 
          value={details.genesis_block_hash} 
          variant="secondary"
        />
        <Field 
          title="Genesis Fee" 
          value={`${details.genesis_fee} sats`} 
          variant="secondary"
        />
        <Field 
          title="Genesis Date" 
          value={new Date(details.genesis_timestamp).toLocaleString()} 
          variant="secondary"
        />

        <Field 
          title="Sat Ordinal" 
          value={details.sat_ordinal.toString()} 
          variant="secondary"
        />
        <Field 
          title="Sat Rarity" 
          value={details.sat_rarity} 
          variant="secondary"
        />
        <Field 
          title="Sat Coinbase Height" 
          value={details.sat_coinbase_height.toString()} 
          variant="secondary"
        />

        <Field 
          title="Location" 
          value={details.location} 
          variant="secondary"
        />
        <Field 
          title="Output" 
          value={details.output} 
          variant="secondary"
        />
        <Field 
          title="Transaction ID" 
          value={details.tx_id} 
          variant="secondary"
        />
        <Field 
          title="Value" 
          value={`${details.value} sats`} 
          variant="secondary"
        />
        <Field 
          title="Date" 
          value={new Date(details.timestamp).toLocaleString()} 
          variant="secondary"
        />
      </div>
    </div>
  );
};
