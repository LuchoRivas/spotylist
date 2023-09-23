import { SpotifyTrackItem } from './spotify-web-api';

export interface PlaylistTrackApiResponse {
  href: string;
  items: SpotifyTrackItem[];
  next: string | null;
  total: number;
}

export interface Playlist extends PlaylistTrackApiResponse {
  playlistId: string;
  name: string;
  imageUrl: string;
}
