import { Router } from 'express';
import { GetPlaylistTracks, GetUserPlaylists } from '../controllers/playlistController';

const router = Router();

router.get('/user-playlists', GetUserPlaylists);
router.get('/playlist-tracks', GetPlaylistTracks);

export default router;
