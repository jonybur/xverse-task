import React from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../assets/back.svg';
import styles from './Navbar.module.scss';

interface NavbarProps {
  title?: string;
  showBackButton?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ title, showBackButton }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <nav className={styles.navbar}>
      {showBackButton && (
        <img 
          src={backIcon} 
          className={styles.backIcon} 
          onClick={handleBack}
          alt="back"
        />
      )}
      {title && <h1 className={styles.title}>{title}</h1>}
    </nav>
  );
};
