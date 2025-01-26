import { FC } from 'react';
import classNames from 'classnames';
import styles from './Field.module.scss';

interface FieldProps {
  title: string;
  value: string;
  variant?: 'primary' | 'secondary';
}

export const Field: FC<FieldProps> = ({ title, value, variant = 'primary' }) => {
  return (
    <div className={classNames(styles.field, styles[variant])}>
      <div className={styles.title}>{title}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
};
