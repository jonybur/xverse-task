import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components'
import styles from './AddressSearch.module.scss';
export const AddressSearch: React.FC = () => {
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedAddress = address.trim();
    if (trimmedAddress) {
      navigate(`/address/${trimmedAddress}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <Input
        type="text"
        value={address}
        label="Owner Bitcoin Address:"
        onChange={(e) => setAddress(e.target.value)}
      />
      <Button type="submit">Look up</Button>
    </form>
  );
}; 