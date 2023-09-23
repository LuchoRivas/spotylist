import './error.scss';

/* eslint-disable-next-line */
export interface ErrorProps {}

export function Error(props: ErrorProps) {
  return (
    <div className={'container'}>
      <h1>
        <strong>ERROR 404! ⚠</strong>
      </h1>
    </div>
  );
}

export default Error;
