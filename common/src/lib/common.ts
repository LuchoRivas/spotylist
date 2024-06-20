import { SpotifyPlaylistResponse } from "./ts/spotify-web-api";

export function common(): string {
  return 'common';
}

export function removeCodeAndStateFromQueryString() {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete('code');
  searchParams.delete('state');
  const newUrl = `${window.location.pathname}?${searchParams.toString()}${
    window.location.hash
  }`;
  window.history.replaceState({}, document.title, newUrl);
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
export const generateRandomString = (length: number) => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

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
