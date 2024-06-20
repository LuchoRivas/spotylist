import { useEffect } from 'react';
import useCallbackLogic from './callback.logic';

function Callback() {
  const { accessTokenExchange } = useCallbackLogic();

  useEffect(() => {
    (async () => accessTokenExchange())();
  }, []);

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
}

export default Callback;
