import apiClient from 'common/src/lib/api-client';
import { SpotifyPlaylist } from 'common/src/lib/ts/spotify-web-api';
import { useState } from 'react';
import { useAuth } from '../../auth-context';
import { Playlist, PlaylistTrackApiResponse } from '@spotylist/common';



function Home() {
  const { accessToken, appUser } = useAuth();
  const [userPlaylists, setUserPlaylists] = useState<SpotifyPlaylist[] | null>(
    null
  );
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  const onLoginClicked = async () => {
    apiClient
      .get('login')
      .then(async (resp: any) => {
        if (resp.status === 200) {
          const { authUrl }: { authUrl: string } = await resp.data;
          if (authUrl) window.location.href = authUrl;
        } else {
          console.log('Error en la respuesta del servidor');
        }
      })
      .catch((reject: any) => {
        console.log('rejected(login)', reject);
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
          // DEBUG PLAYLIST
          // console.log('data: SpotifyPlaylist', playlists);
        } else {
          console.log('Error en la respuesta del servidor');
        }
      })
      .catch((reject: any) => {
        console.log('rejected(user-playlists)', reject);
      });
  };

  const onPlaylistClicked = ({
    playlistId,
    name,
    imageUrl,
  }: {
    playlistId: string;
    name: string;
    imageUrl: string;
  }) => {
    apiClient
      .get('playlist-tracks', { params: { playlistId } })
      .then(async (response: any) => {
        if (response.status === 200) {
          const { items, total, next, href } = await response.data as PlaylistTrackApiResponse;
          setPlaylist({ items, total, next, href, playlistId, name, imageUrl });
        } else {
          console.log('Error en la respuesta del servidor');
        }
      })
      .catch((reject: any) => {
        console.log('rejected(playlist-tracks)', reject);
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
          <button className='button-rechoncho' onClick={onLoginClicked}>Login con Spotify</button>
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
            {!playlist && (
              <div>
                <span>Para comenzar presione en cargar playlists</span>
                <button className='button' onClick={onLoadMyPlaylistsClicked}>
                  Cargar mis playlists
                </button>
              </div>
            )}
            {userPlaylists && !playlist && (
              <div className="grid-container">
                {userPlaylists.map((userPlaylist) => (
                  <div
                    className="grid-item"
                    key={userPlaylist.id}
                    onClick={() =>
                      onPlaylistClicked({
                        playlistId: userPlaylist.id,
                        name: userPlaylist.name,
                        imageUrl: userPlaylist.images[1]
                          ? userPlaylist.images[1].url
                          : userPlaylist.images[0].url,
                      })
                    }
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
            {playlist && (
              <div>
                <h3>{playlist.name}</h3>
                <br />

                <button className='button' onClick={() => setPlaylist(null)}>volver</button>
                <br />
                <br />

                <table>
                  <tr>
                    <th>Artistas</th>
                    <th>Canción</th>
                    <th>Álbum</th>
                  </tr>
                  {playlist.items.map((playlistItem) => (
                    <tr>
                      <td>
                        {playlistItem.track.artists
                          .map((artist) => artist.name)
                          .join(', ')}
                      </td>
                      <td>{playlistItem.track.name}</td>
                      <td>{playlistItem.track.album.name}</td>
                    </tr>
                  ))}
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
