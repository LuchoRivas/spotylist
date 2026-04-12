import axios from 'axios';
import { env } from '../config/env.config';
import {
  SpotifyPlaylistResponse,
  SpotifyPlaylistTrackResponse,
  SpotifyUser,
} from '@spotylist/common';

const spotifyApi = axios.create({
  baseURL: env.spotifyApiBaseUrl,
});

const spotifyAccounts = axios.create({
  baseURL: env.spotifyAccountsUrl,
});

export async function exchangeCodeForTokens(code: string) {
  const { data } = await spotifyAccounts.post(
    '/api/token',
    new URLSearchParams({
      code,
      redirect_uri: env.redirectUri,
      grant_type: 'authorization_code',
    }),
    {
      headers: {
        Authorization: `Basic ${env.basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return {
    access_token: data.access_token as string,
    refresh_token: data.refresh_token as string,
  };
}

export async function getUserProfile(accessToken: string): Promise<SpotifyUser> {
  const { data } = await spotifyApi.get('/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
}

export async function getUserPlaylists(
  userId: string,
  authorization: string
): Promise<SpotifyPlaylistResponse> {
  const limit = 50;
  let offset = 0;
  let allItems: SpotifyPlaylistResponse['items'] = [];
  let response: SpotifyPlaylistResponse;

  do {
    const { data } = await spotifyApi.get<SpotifyPlaylistResponse>(
      `/users/${userId}/playlists`,
      {
        params: { limit, offset },
        headers: { Authorization: authorization },
      }
    );
    response = data;
    allItems = allItems.concat(response.items);
    offset += limit;
  } while (response.total > offset);

  return { ...response, items: allItems };
}

export async function getPlaylistTracks(
  playlistId: string,
  authorization: string
): Promise<SpotifyPlaylistTrackResponse> {
  let offset = 0;
  let allItems: SpotifyPlaylistTrackResponse['items'] = [];
  let response: SpotifyPlaylistTrackResponse;

  do {
    const { data } = await spotifyApi.get<SpotifyPlaylistTrackResponse>(
      `/playlists/${playlistId}/tracks`,
      {
        params: { offset },
        headers: { Authorization: authorization },
      }
    );
    response = data;
    allItems = allItems.concat(response.items);
    offset += 100;
  } while (response.next);

  return { ...response, items: allItems };
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const { data } = await spotifyAccounts.post(
    '/api/token',
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    {
      headers: {
        Authorization: `Basic ${env.basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return data.access_token;
}
