import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AddressSearch: React.FC = () => {
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      navigate(`/address/${address}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Bitcoin Address"
      />
      <button type="submit">Search</button>
    </form>
  );
}; 