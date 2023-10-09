/* eslint-disable no-eval */
import apiClient from 'common/src/lib/api-client';
import {
  SpotifyPlaylist,
  SpotifyTrackItem,
} from 'common/src/lib/ts/spotify-web-api';
import { useCallback, useState } from 'react';
import { useAuth } from '../../auth-context';
import { Playlist, PlaylistTrackApiResponse } from '@spotylist/common';
import PlaylistTable, {
  SortColumn,
  SortDirection,
} from '../../../components/playlist-table/playlist-table';
import Header from '../../../components/header/header';
import PlaylistGrid from '../../../components/playlist-grid/playlist-grid';

function Home() {
  const { accessToken, appUser } = useAuth();
  const [userPlaylists, setUserPlaylists] = useState<SpotifyPlaylist[] | null>(
    null
  );
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

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

  // Playlist table logic
  const onDragPlaylistItemOrder = useCallback(
    (orderedPlaylist: SpotifyTrackItem[]) => {
      if (!playlist) return;
      const updatedOrder: Playlist = { ...playlist, items: orderedPlaylist };
      setPlaylist(updatedOrder);
    },
    [playlist]
  );

  const onColumnChange = useCallback(
    (
      playlistItems: SpotifyTrackItem[],
      column: SortColumn,
      direction: SortDirection
    ) => {
      const columnMap = {
        artist: 'track.artists[0].name',
        album: 'track.album.name',
        song: 'track.name',
      };
      if (!columnMap[column]) {
        // Column no reconocida
        return;
      }
      const sort = [...playlistItems].sort((a, b) => {
        const columnA = eval(`a.${columnMap[column]}`) || '';
        const columnB = eval(`b.${columnMap[column]}`) || '';

        if (direction === 'asc') {
          return columnA.localeCompare(columnB);
        } else {
          return columnB.localeCompare(columnA);
        }
      });
      playlist && setPlaylist({ ...playlist, items: sort });
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
          <Header />
          <div>
            {!playlist && (
              <div>
                <button className="button" onClick={onLoadMyPlaylistsClicked}>
                  Cargar mis playlists
                </button>
              </div>
            )}
            {userPlaylists && !playlist && (
              <PlaylistGrid
                onClick={onPlaylistClicked}
                userPlaylists={userPlaylists}
              />
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
                  onChange={onColumnChange}
                  onDrag={onDragPlaylistItemOrder}
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
