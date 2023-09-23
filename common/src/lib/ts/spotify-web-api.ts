export interface SpotifyUser {
  display_name: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: [];
  type: string;
  uri: string;
  followers: {
    href: null;
    total: number;
  };
  country: string;
  product: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  email: string;
}

export interface SpotifyPlaylistResponse {
  href: string;
  items: SpotifyPlaylist[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  error?: SpotifyError;
}

interface SpotifyError {
  message: string;
  status: number;
}

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: string | null;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}

interface SpotifyImage {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyResponse {
  access_token: string;
  refresh_token: string;
  user: SpotifyUser;
}

export interface SpotifyPlaylistTrackResponse {
  href: string;
  items: SpotifyTrackItem[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  error?: SpotifyError;
}

export interface SpotifyTrackItem {
  added_at: string;
  added_by: SpotifyUser;
  is_local: boolean;
  primary_color: string | null;
  track: SpotifyTrack;
  video_thumbnail: {
    url: string | null;
  };
}

interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
}

interface SpotifyAlbum {
  album_type: string;
  artists: SpotifyArtist[];
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}