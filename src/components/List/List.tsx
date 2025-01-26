import React from 'react';
import classNames from 'classnames';
import { Item } from './Item';
import styles from './List.module.scss';

interface ListProps {
  items: string[];
  className?: string;
  onItemClick?: (index: number) => void;
}

export const List: React.FC<ListProps> = ({
  items,
  className = '',
  onItemClick,
}) => {
  return (
    <div className={classNames(styles.root, className)}>
      {items.map((text, index) => (
        <Item 
          key={index}
          text={text}
          onClick={() => onItemClick?.(index)}
        />
      ))}
    </div>
  );
}; 