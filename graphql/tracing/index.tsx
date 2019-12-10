import * as React from 'react';
import styles from './styles.css';
import { useFetch } from './utils';
import TracingTable from './TracingTable';

export default function Tracer({ traceId }: { traceId?: string }) {
  const response = useFetch('/admin/graphql-tracing/');

  if (!response.data) {
    return null;
  }

  return (
    <div className={styles.container}>
      <ul className={styles.menu}>
        {response.data.map((record: any) => (
          <li key={record.id}>
            <a href={`?traceId=${record.id}`}>
              {record.id === traceId
                ? `[${record.operationName}]`
                : record.operationName}
            </a>
          </li>
        ))}
      </ul>
      {traceId && <LoadTrace traceId={traceId} />}
    </div>
  );
}

Tracer.getInitialProps = async (context: { query: any }) => {
  return { traceId: (context.query || {}).traceId };
};

function LoadTrace({ traceId }: { traceId: string }) {
  const response = useFetch(`/admin/graphql-tracing/${traceId}`);

  if (!response.data) {
    return null;
  }

  return <TracingTable tracing={response.data} />;
}
