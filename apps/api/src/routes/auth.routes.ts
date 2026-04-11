import { Router } from 'express';
import { login, callback, refreshToken } from '../controllers/auth.controller';
import { asyncHandler } from '../middleware/async-handler';

const router = Router();

router.get('/login', asyncHandler(login));
router.get('/callback', asyncHandler(callback));
router.get('/refresh_token', asyncHandler(refreshToken));

export default router;
