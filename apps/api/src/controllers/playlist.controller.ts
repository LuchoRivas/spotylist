import { Request, Response } from 'express';
import { SpotifyTrackItem } from '@spotylist/common';
import { getUserPlaylists, getPlaylistTracks } from '../services/spotify.service';
import { filterUserPlaylists } from '../utils';

export async function userPlaylists(req: Request, res: Response) {
  const userId = req.query.userId as string;
  const authorization = req.headers.authorization as string;

  const playlistsData = await getUserPlaylists(userId, authorization);
  const playlists = filterUserPlaylists(playlistsData, userId);

  res.json({ playlists });
}

export async function playlistTracks(req: Request, res: Response) {
  const playlistId = req.query.playlistId as string;
  const authorization = req.headers.authorization as string;

  const tracksData = await getPlaylistTracks(playlistId, authorization);

  const mappedItems: SpotifyTrackItem[] = tracksData.items.map(
    (playlistItem, index) => ({
      ...playlistItem,
      id: `track_${playlistItem.track.id}${index}`,
    })
  );

  const { total, next, href } = tracksData;
  res.json({ items: mappedItems, total, next, href });
}
