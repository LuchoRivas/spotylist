import { setAuthTokenHeader, SpotifyResponse } from '@spotylist/common';
import apiClient from 'common/src/lib/api-client';
import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth-context';

function Callback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAccessToken, setRefreshToken, setAppUser } = useAuth();
  const fetchDataFromAPI = useCallback(
    async (code: string, state: string) => {
      try {
        const response = await apiClient.get('callback', {
          params: {
            code,
            state,
          },
        });
        const data: SpotifyResponse = await response.data;

        if (data.access_token && data.refresh_token) {
          setAuthTokenHeader(data.access_token);
          setAccessToken(data.access_token);
          setRefreshToken(data.refresh_token);
          setAppUser(data.user);
          navigate('/');
        }
      } catch (error) {
        console.error('Error al enviar los parámetros a la API:', error);
        navigate('/404');
      }
    },
    [setAccessToken, setRefreshToken, setAppUser, navigate]
  );

  useEffect(() => {
    (async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (code && state) {
        await fetchDataFromAPI(code, state);
      } else {
        console.error(
          'Los parámetros "code" y/o "state" no están presentes en la URL.'
        );
      }
    })();
  }, [fetchDataFromAPI, location]);

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
}

export default Callback;
