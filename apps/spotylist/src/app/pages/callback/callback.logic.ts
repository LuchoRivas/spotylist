import apiClient, { setAuthTokenHeader } from 'common/src/lib/api-client';
import { useCallback } from 'react';
import { useAuth } from '../../auth-context';
import { SpotifyResponse } from '@spotylist/common';

function useCallbackLogic() {
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

  return { fetchDataFromAPI };
}

export default useCallbackLogic;
