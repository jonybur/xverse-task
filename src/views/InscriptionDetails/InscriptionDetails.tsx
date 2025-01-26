import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInscriptionDetails } from "../../services/api";
import { InscriptionDetails as IInscriptionDetails } from "../../types/types";
import { Title } from "../../components";
import styles from './InscriptionDetails.module.scss';

export const InscriptionDetails: React.FC = () => {
  const { address, inscriptionId } = useParams<{
    address: string;
    inscriptionId: string;
  }>();
  const [details, setDetails] = useState<IInscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  console.log({ details });

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
  if (!details) return <div>No details found</div>;

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
      <div>
        <p>ID: {details.id}</p>
        <p>Number: {details.number}</p>
        <p>Content Type: {details.content_type}</p>
        {details.collection_name && (
          <p>Collection: {details.collection_name}</p>
        )}
      </div>
    </div>
  );
};
