import { useCallback, useState } from 'react';
import { useAuth } from '../../auth-context';
import apiClient from 'common/src/lib/api-client';
import {
  Playlist,
  PlaylistTrackApiResponse,
  SpotifyPlaylist,
  SpotifyTrackItem,
} from '@spotylist/common';
import {
  SortColumn,
  SortDirection,
} from 'apps/spotylist/src/components/playlist-table/playlist-table';

function useHomeLogic() {
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

  return {
    accessToken,
    userPlaylists,
    playlist,
    setPlaylist,
    onLoginClicked,
    onLoadMyPlaylistsClicked,
    onPlaylistClicked,
    onDragPlaylistItemOrder,
    onColumnChange
  }
}

export default useHomeLogic;
