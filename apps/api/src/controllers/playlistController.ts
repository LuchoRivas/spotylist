import { Response } from 'express';
import request from 'request';
import { spotifyAPIBaseUrl } from '../config/config';
import { filterUserPlaylists } from '../utils/utils';
import { SpotifyPlaylist, SpotifyPlaylistResponse, SpotifyPlaylistTrackResponse, SpotifyTrackItem } from '@spotylist/common';

export function GetUserPlaylists(req: any, res: Response) {
  const { userId } = req.query || '';
  const limit = 50;
  let offset = 0;
  const playlists: SpotifyPlaylist[] = [];

  const fetchPlaylists = () => {
    const options = {
      url: `${spotifyAPIBaseUrl}/users/${userId}/playlists?limit=${limit}&offset=${offset}`,
      headers: { Authorization: req.headers.authorization },
      json: true,
    };

    request.get(options, (error, response, userplaylistsData: SpotifyPlaylistResponse) => {
      if (!error && response.statusCode === 200) {
        const filteredPlaylists = filterUserPlaylists(userplaylistsData, userId);
        playlists.push(...filteredPlaylists);

        if (userplaylistsData.total > limit + offset) {
          offset += limit;
          fetchPlaylists();
        } else {
          res.status(200).json({ playlists });
        }
      } else if (userplaylistsData.error?.status === 401 && userplaylistsData.error?.message === 'The access token expired') {
        res.status(401).json({ error: 'Token expired' });
      } else {
        res.status(response.statusCode || 500).json({ Error: error });
        console.error(error);
      }
    });
  };

  fetchPlaylists();
};

export function GetPlaylistTracks(req: any, res: Response) {
  const { playlistId } = req.query || '';
  let offset = 0;
  const allPlaylistTracks: SpotifyTrackItem[] = [];

  const fetchPlaylistTracks = () => {
    const options = {
      url: `${spotifyAPIBaseUrl}/playlists/${playlistId}/tracks?offset=${offset}`,
      headers: { Authorization: req.headers.authorization },
      json: true,
    };

    request.get(options, (error, response, playlistTracks: SpotifyPlaylistTrackResponse) => {
      if (!error && response.statusCode === 200) {
        allPlaylistTracks.push(...playlistTracks.items);
        if (playlistTracks.next) {
          offset += 100;
          fetchPlaylistTracks();
        } else {
          const mappedItems: SpotifyTrackItem[] = allPlaylistTracks.map((playlistItem, index) => ({
            ...playlistItem,
            id: `track_${playlistItem.track.id}${index}`,
          }));
          const { total, next, href } = playlistTracks;
          res.status(200).json({ items: mappedItems, total, next, href });
        }
      } else if (playlistTracks.error?.status === 401 && playlistTracks.error?.message === 'The access token expired') {
        res.status(401).json({ error: 'Token expired' });
      } else {
        res.status(response.statusCode || 500).json({ Error: error });
        console.error(error);
      }
    });
  };

  fetchPlaylistTracks();
};
