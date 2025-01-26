import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AddressSearch } from './components/AddressSearch';
import { InscriptionsList } from './components/InscriptionsList';
import { InscriptionDetails } from './components/InscriptionDetails';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <h1>Bitcoin Ordinals Viewer</h1>
        <Routes>
          <Route path="/" element={<AddressSearch />} />
          <Route path="/address/:address" element={<InscriptionsList />} />
          <Route path="/inscription/:address/:inscriptionId" element={<InscriptionDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
