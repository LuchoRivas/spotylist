import { Router } from 'express';
import { userPlaylists, playlistTracks } from '../controllers/playlist.controller';
import { asyncHandler } from '../middleware/async-handler';

const router = Router();

router.get('/user-playlists', asyncHandler(userPlaylists));
router.get('/playlist-tracks', asyncHandler(playlistTracks));

export default router;
