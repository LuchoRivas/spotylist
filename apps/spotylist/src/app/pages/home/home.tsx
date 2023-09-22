import apiClient from 'common/src/lib/api-client';
import { SpotifyPlaylist } from 'common/src/lib/ts/spotify-web-api';
import { useState } from 'react';
import { useAuth } from '../../auth-context';

interface ServerResponse {
  authUrl: string;
}

function Home() {
  const { accessToken, appUser } = useAuth();
  const [userPlaylists, setUserPlaylists] = useState<SpotifyPlaylist[] | null>(
    null
  );

  const onLoginClicked = async () => {
    apiClient
      .get('login')
      .then(async (resp: any) => {
        if (resp.status === 200) {
          const { authUrl }: ServerResponse = await resp.data;
          if (authUrl) window.location.href = authUrl;
        } else {
          console.log('Error en la respuesta del servidor');
        }
      })
      .catch((reject: any) => {
        console.log('rejected', reject);
      });
  };

  const onLoadMyPlaylistsClicked = async () => {
    if (!accessToken || !appUser) return;
    apiClient
      .get('user-playlists', { params: { userId: appUser.id } })
      .then(async (response: any) => {
        if (response.status === 200) {
          const { playlists } = await response.data;
          setUserPlaylists(playlists);
          console.log('data: SpotifyPlaylist', playlists);
        } else {
          console.log('Error en la respuesta del servidor');
        }
      })
      .catch((reject: any) => {
        console.log('rejected', reject);
      });
  };

  const onPlaylistClicked = (playlistId: string) => {
    console.log('PL id', playlistId);
    apiClient
      .get('playlist-tracks', { params: { playlistId } })
      .then(async (response: any) => {
        if (response.status === 200) {
          const { playlists } = await response.data;
          setUserPlaylists(playlists);
          console.log('data: SpotifyPlaylist', playlists);
        } else {
          console.log('Error en la respuesta del servidor');
        }
      })
      .catch((reject: any) => {
        console.log('rejected', reject);
      });
  };

  return (
    <div>
      {!accessToken && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignSelf: 'center',
            flex: 1,
          }}
        >
          <button onClick={onLoginClicked}>Login con Spotify</button>
        </div>
      )}
      {accessToken && (
        <div>
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: 20,
            }}
          >
            <div>Spotylist</div>
            <div>Hola {appUser?.display_name}</div>
          </header>
          <div>
            <span>Para comenzar presione en cargar playlists</span>
            <button onClick={onLoadMyPlaylistsClicked}>
              Cargar mis playlists
            </button>
            {userPlaylists && (
              <div className="grid-container">
                {userPlaylists.map((userPlaylist) => (
                  <div
                    className="grid-item"
                    key={userPlaylist.id}
                    onClick={() => onPlaylistClicked(userPlaylist.id)}
                  >
                    <span>{userPlaylist.name}</span>
                    <img
                      src={
                        userPlaylist.images[1]
                          ? userPlaylist.images[1].url
                          : userPlaylist.images[0].url
                      }
                      alt={`${userPlaylist.id}-pl-cover`}
                    />

                    <span>{`${userPlaylist.tracks.total} tracks`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
