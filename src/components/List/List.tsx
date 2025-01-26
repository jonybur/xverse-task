import React from 'react';
import classNames from 'classnames';
import { List as VirtualList, AutoSizer } from 'react-virtualized';
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
  const rowRenderer = ({ key, index, style }: { key: string, index: number, style: React.CSSProperties }) => (
    <div key={key} style={{ ...style, height: '49px', marginBottom: '10px' }}>
      <Item
        text={items[index]}
        onClick={() => onItemClick?.(index)}
      />
    </div>
  );

  return (
    <div className={classNames(styles.root, className)}>
      <AutoSizer>
        {({ width, height }) => (
          <VirtualList
            width={width}
            height={height}
            rowCount={items.length}
            rowHeight={59}
            rowRenderer={rowRenderer}
            overscanRowCount={5}
            style={{ outline: 'none' }}
            scrollToAlignment="start"
          />
        )}
      </AutoSizer>
    </div>
  );
}; 