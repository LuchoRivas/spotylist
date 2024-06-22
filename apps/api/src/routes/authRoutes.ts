import { Router } from 'express';
import { Login, Callback, RefreshToken } from '../controllers/authController';

const router = Router();

router.get('/login', Login);
router.get('/callback', Callback);
router.get('/refresh_token', RefreshToken);

export default router;
