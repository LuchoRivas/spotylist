import { Router } from 'express';
import { getUserPlaylists, getPlaylistTracks } from '../controllers/playlistController';

const router = Router();

router.get('/user-playlists', getUserPlaylists);
router.get('/playlist-tracks', getPlaylistTracks);

export default router;
