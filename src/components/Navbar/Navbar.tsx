import React from 'react';
import { useNavigate } from 'react-router-dom';
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
        <button className={styles.backButton} onClick={handleBack} />
      )}
      {title && <h1 className={styles.title}>{title}</h1>}
    </nav>
  );
};
