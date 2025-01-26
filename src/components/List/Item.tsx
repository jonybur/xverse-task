import React from 'react';
import classNames from 'classnames';
import forwardIcon from '../../assets/forward.svg';
import styles from './List.module.scss';

interface ItemProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

export const Item: React.FC<ItemProps> = ({
  text,
  className = '',
  onClick
}) => {
  return (
    <div 
      className={classNames(styles.item, className)}
      onClick={onClick}
    >
      <span className={styles.itemText}>{text}</span>
      <img src={forwardIcon} className={styles.itemIcon} alt="forward" />
    </div>
  );
}; 