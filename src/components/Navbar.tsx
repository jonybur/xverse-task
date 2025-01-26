import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.scss';

interface NavbarProps {
  title?: string;
  showBackButton?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ title, showBackButton }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <nav className="navbar">
      {showBackButton && (
        <button className="navbar__back-button" onClick={handleBack} />
      )}
      {title && <h1 className="navbar__title">{title}</h1>}
    </nav>
  );
};

export default Navbar; 