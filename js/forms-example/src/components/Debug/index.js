import * as React from 'react';
import styles from './styles.module.css';

export default function Debug({ value }) {
  return <pre className={styles.code}>{JSON.stringify(value, null, 2)}</pre>;
}
