import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AddressSearch, InscriptionsList, InscriptionDetails } from './views';
import { Navbar } from './components';
import styles from './App.module.scss';
const AppContent: React.FC = () => {
  const location = useLocation();
  const showBackButton = location.pathname.startsWith('/inscription/');
  const getTitle = () => {
    if (location.pathname.startsWith('/inscription/')) return 'Details';
    return 'Ordinal Inscription Lookup';
  };

  return (
    <div className={styles.appContainer}>
      <Navbar title={getTitle()} showBackButton={showBackButton} />
      <Routes>
        <Route path="/" element={<AddressSearch />} />
        <Route path="/address/:address" element={<InscriptionsList />} />
        <Route path="/inscription/:address/:inscriptionId" element={<InscriptionDetails />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
