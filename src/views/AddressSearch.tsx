import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <form onSubmit={handleSubmit}>
      <span>Owner Bitcoin Address:</span>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button type="submit">Look up</button>
    </form>
  );
}; 