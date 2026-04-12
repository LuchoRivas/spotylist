import { useCallback, useState } from 'react';
import {
  apiClient,
  Playlist,
  PlaylistTrackApiResponse,
  SpotifyPlaylist,
  SpotifyTrackItem,
} from '@spotylist/common';
import { useAuth } from '../../auth-context';
import { SortColumn, SortDirection } from '../../../components/playlist-table/playlist-table';

export function useHome() {
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

  const onLoadMyPlaylistsClicked = useCallback(async () => {
    if (!accessToken || !appUser) return;
    try {
      const response = await apiClient.get('user-playlists', {
        params: { userId: appUser.id },
      });
      if (response.status === 200) {
        const { playlists } = response.data;
        setUserPlaylists(playlists);
      } else {
        console.log('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.log('rejected(user-playlists)', error);
    }
  }, [accessToken, appUser]);

  const onPlaylistClicked = useCallback(
    async ({
      playlistId,
      name,
      imageUrl,
    }: {
      playlistId: string;
      name: string;
      imageUrl: string;
    }) => {
      try {
        const response = await apiClient.get('playlist-tracks', {
          params: { playlistId },
        });
        if (response.status === 200) {
          const { items, total, next, href } =
            response.data as PlaylistTrackApiResponse;
          setPlaylist({ items, total, next, href, playlistId, name, imageUrl });
        } else {
          console.log('Error en la respuesta del servidor');
        }
      } catch (error) {
        console.log('rejected(playlist-tracks)', error);
      }
    },
    []
  );

  const onDragPlaylistItemOrder = useCallback(
    (orderedPlaylist: SpotifyTrackItem[]) => {
      if (!playlist) return;
      setPlaylist({ ...playlist, items: orderedPlaylist });
    },
    [playlist]
  );

  const onColumnChange = useCallback(
    (
      playlistItems: SpotifyTrackItem[],
      column: SortColumn,
      direction: SortDirection
    ) => {
      const columnAccessor: Record<SortColumn, (item: SpotifyTrackItem) => string> = {
        artist: (item) => item.track.artists[0]?.name || '',
        album: (item) => item.track.album.name || '',
        song: (item) => item.track.name || '',
      };
      const getValue = columnAccessor[column];
      if (!getValue) return;

      const sort = [...playlistItems].sort((a, b) => {
        const columnA = getValue(a);
        const columnB = getValue(b);
        return direction === 'asc'
          ? columnA.localeCompare(columnB)
          : columnB.localeCompare(columnA);
      });
      playlist && setPlaylist({ ...playlist, items: sort });
    },
    [playlist]
  );

  const onClearPlaylist = useCallback(() => setPlaylist(null), []);

  return {
    accessToken,
    userPlaylists,
    playlist,
    onLoginClicked,
    onLoadMyPlaylistsClicked,
    onPlaylistClicked,
    onDragPlaylistItemOrder,
    onColumnChange,
    onClearPlaylist,
  };
}
