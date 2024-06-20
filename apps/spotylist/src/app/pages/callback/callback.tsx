import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useCallbackLogic from './callback.logic';

function Callback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchDataFromAPI } = useCallbackLogic();

  useEffect(() => {
    (async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (code && state) {
        fetchDataFromAPI(code, state)
          .then((res) => {
            navigate('/');
          })
          .catch((err) => {
            console.log('fetchDataFromAPI error', err);
            navigate('/404');
          })
          .finally();
      } else {
        console.error(
          'Los parámetros "code" y/o "state" no están presentes en la URL.'
        );
      }
    })();
  }, []);

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
}

export default Callback;
