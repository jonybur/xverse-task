import React from 'react';
import classNames from 'classnames';
import styles from './Title.module.scss';

type TitleVariant = 'title' | 'subtitle' | 'small';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  variant?: TitleVariant;
}

export const Title: React.FC<TitleProps> = ({ 
  children, 
  className = '',
  variant = 'title'
}) => {
  return (
    <div className={classNames(
      styles.root,
      styles[variant],
      className
    )}>
      {children}
    </div>
  );
}; 