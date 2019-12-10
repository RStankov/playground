import * as React from 'react';
import styles from './styles.css';
import { set, get } from 'lodash';

function TracingTable({ tracing }: { tracing: any }) {
  return (
    <div className={styles.table}>
      <InfoRow duration={tracing.duration} />
      {group(tracing.execution.resolvers).map((res: any, i: any) => (
        <TracingRow key={i} data={res} durationTotal={tracing.duration} />
      ))}
      <InfoRow duration={tracing.duration} />
    </div>
  );
}

export default React.memo(TracingTable);

interface ITraceData {
  path: string[];
  startOffsets: number[];
  durations: number[];
  io: any[];
  durationSum: number;
  count: number;
  fieldName: string;
}

function group(array: any[]): ITraceData[] {
  const result = array.reduce(
    (acc, tracing) => {
      const key =
        tracing.path
          .filter((field: number | string) => typeof field === 'string')
          .join('.') + '.__trace';

      let data = get(acc, key);

      if (!data) {
        data = {
          path: tracing.path,
          startOffsets: [],
          durations: [],
          io: [],
          durationSum: 0,
          count: 0,
          fieldName: tracing.fieldName,
        };
      }

      data.startOffsets.push(tracing.startOffset);
      data.durations.push(tracing.duration);
      data.io = data.io.concat(tracing.io);
      data.durationSum += tracing.duration;
      data.count += 1;

      set(acc, key, data);

      return acc;
    },
    {} as any,
  );

  return flatten(result);
}

function flatten(result: any[], array = []): any[] {
  return Object.values(result).reduce((acc, object) => {
    const { __trace: trace, ...others } = object;

    acc.push(trace);

    return flatten(others, acc);
  }, array);
}

function InfoRow({ duration }: { duration: number }) {
  return (
    <div className={styles.row}>
      <span className={styles.name}>Request</span>
      <div
        className={styles.barContainer}
        style={{ width: durationWidth(duration) }}>
        <Bar startOffset={0} duration={duration} />
      </div>
      <Duration duration={duration} />
    </div>
  );
}

interface ITracingRowProps {
  durationTotal: number;
  data: ITraceData;
}

export const TracingRow = ({ durationTotal, data }: ITracingRowProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const usedFieldName = data.path.slice(-1)[0];

  return (
    <React.Fragment>
      <div className={styles.row}>
        <span
          className={styles.name}
          title={data.path.join('.')}
          style={{ paddingLeft: data.path.length * 10 }}>
          {usedFieldName === data.fieldName ? (
            data.fieldName
          ) : (
            <React.Fragment>
              {usedFieldName}
              <Small> /{data.fieldName}/</Small>
            </React.Fragment>
          )}
          {data.count > 1 && <Small> ({data.count})</Small>}
        </span>
        <div
          className={styles.barContainer}
          style={{ width: durationWidth(durationTotal) }}>
          {data.startOffsets.map((startOffset, i) => (
            <Bar
              key={i}
              startOffset={startOffset}
              duration={data.durations[i]}
            />
          ))}
        </div>
        <Duration duration={data.durationSum} />
        {data.io.length > 0 && (
          <span className={styles.ioButton} onClick={() => setIsOpen(!isOpen)}>
            {data.io.length}
          </span>
        )}
      </div>
      {isOpen && (
        <ol>
          {data.io.map((item, i) => (
            <li key={i}>
              <small>
                {item.sql && <code>{clearComments(item.sql)}</code>}
                {item.cacheKey && (
                  <code>
                    CACHE
                    {item.cacheHit ? ' HIT' : ' MISS'} => {item.cacheKey}
                  </code>
                )}
              </small>
              <Duration duration={item.duration} />
            </li>
          ))}
        </ol>
      )}
    </React.Fragment>
  );
};

function Small({ children }: { children: React.ReactNode }) {
  return <small className={styles.small}>{children}</small>;
}

const FACTOR = 1000 * 1000;

function durationWidth(duration: number) {
  return Math.max(Math.round(duration / FACTOR), 1);
}

function Bar({
  duration,
  startOffset,
}: {
  duration: number;
  startOffset: number;
}) {
  return (
    <span
      className={styles.bar}
      style={{
        width: durationWidth(duration),
        left: durationWidth(startOffset),
      }}
    />
  );
}

function Duration({ duration }: { duration: number }) {
  return <span className={styles.duration}>{printDuration(duration)}</span>;
}

function printDuration(nanoSeconds: number) {
  const microSeconds = Math.round(nanoSeconds / 1000);
  if (microSeconds > 1000) {
    return `${Math.round(microSeconds / 1000)} ms`;
  }

  return `${microSeconds} µs`;
}

function clearComments(sql: string) {
  return sql.replace(/\/\*.*\*\//g, '');
}
