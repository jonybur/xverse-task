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

const formatTitle = (key: string): string => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatValue = (key: string, value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return '';
  
  switch (key) {
    case 'content_length':
      return `${toString(value)} bytes`;
    case 'inscription_floor_price':
      return `${toString(value)} BTC`;
    case 'genesis_fee':
    case 'value':
      return `${toString(value)} sats`;
    case 'genesis_timestamp':
    case 'timestamp':
      return new Date(value).toLocaleString();
    default:
      return toString(value);
  }
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
        
        {Object.entries(details).map(([key, value]) => {
          if (!['id', 'address'].includes(key) && !isValueEmpty(value)) {
            return (
              <Field
                key={key}
                title={formatTitle(key)}
                value={formatValue(key, value)}
                variant="secondary"
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
