import apiClient, { setAuthTokenHeader } from 'common/src/lib/api-client';
import { useCallback } from 'react';
import { useAuth } from '../../auth-context';
import { SpotifyResponse } from '@spotylist/common';
import { useLocation, useNavigate } from 'react-router-dom';

function useCallbackLogic() {
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
        }
      } catch (error) {
        console.error('Error al enviar los parámetros a la API:', error);
      }
    },
    [setAccessToken, setRefreshToken, setAppUser]
  );

  const accessTokenExchange = () => {
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
  };

  return { accessTokenExchange };
}

export default useCallbackLogic;
