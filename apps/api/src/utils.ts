import { SpotifyPlaylistResponse } from '@spotylist/common';

/**
 * Filter playlists created by the logged user
 * @param  {SpotifyPlaylistResponse} playlistsData All playlists data from Spotify
 * @param  {string} userId Spotify id
 * @return {SpotifyPlaylist[]} Playlists created by the logged in user
 */
export const filterUserPlaylists = (
  playlistsData: SpotifyPlaylistResponse,
  userId: string
) => {
  return playlistsData.items.filter(
    (playlist: any) => playlist.owner.id === userId
  );
};
