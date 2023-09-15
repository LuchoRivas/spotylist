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
