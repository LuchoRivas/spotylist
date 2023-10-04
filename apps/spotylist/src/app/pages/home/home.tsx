import apiClient from 'common/src/lib/api-client';
import {
  SpotifyPlaylist,
  SpotifyTrackItem,
} from 'common/src/lib/ts/spotify-web-api';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../auth-context';
import { Playlist, PlaylistTrackApiResponse } from '@spotylist/common';
import PlaylistTable from '../../..//components/playlist-table/playlist-table';

function Home() {
  const { accessToken, appUser } = useAuth();
  const [userPlaylists, setUserPlaylists] = useState<SpotifyPlaylist[] | null>(
    null
  );
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  const onLoginClicked = useCallback(async () => {
    try {
      const resp = await apiClient.get('login');
      if (resp.status === 200) {
        const { authUrl }: { authUrl: string } = await resp.data;
        if (authUrl) window.location.href = authUrl;
      } else {
        console.log('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }, []);

  const onLoadMyPlaylistsClicked = async () => {
    if (!accessToken || !appUser) return;
    apiClient
      .get('user-playlists', { params: { userId: appUser.id } })
      .then(async (response: any) => {
        if (response.status === 200) {
          const { playlists } = await response.data;
          setUserPlaylists(playlists);
        } else {
          console.log('Error en la respuesta del servidor');
        }
      })
      .catch((reject: any) => {
        console.log('rejected(user-playlists)', reject);
      });
  };

  const onPlaylistClicked = useCallback(
    ({
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
            const { items, total, next, href } =
              (await response.data) as PlaylistTrackApiResponse;
            setPlaylist({
              items,
              total,
              next,
              href,
              playlistId,
              name,
              imageUrl,
            });
          } else {
            console.log('Error en la respuesta del servidor');
          }
        })
        .catch((reject: any) => {
          console.log('rejected(playlist-tracks)', reject);
        });
    },
    []
  );

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsHeaderSticky(true);
    } else {
      setIsHeaderSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [playlist]);

  const onChangePlaylistOrder = useCallback(
    (orderedPlaylist: SpotifyTrackItem[]) => {
      if (!playlist) return;
      const updatedOrder: Playlist = { ...playlist, items: orderedPlaylist };
      setPlaylist(updatedOrder);
    },
    [playlist]
  );

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
          <span className="button-rechoncho" onClick={onLoginClicked}>
            Login con Spotify
          </span>
        </div>
      )}
      {accessToken && (
        <div>
          <header className={`sticky-header${isHeaderSticky ? ' sticky' : ''}`}>
            <div>Listofy</div>
            <div>Hola {appUser?.display_name}</div>
            {isHeaderSticky && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Volver Arriba
              </button>
            )}
          </header>
          <div>
            {!playlist && (
              <div>
                <button className="button" onClick={onLoadMyPlaylistsClicked}>
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
                    <strong>{userPlaylist.name}</strong>
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

                <button className="button" onClick={() => setPlaylist(null)}>
                  volver
                </button>
                <br />
                <br />
                <PlaylistTable
                  onChange={onChangePlaylistOrder}
                  playlist={playlist}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
