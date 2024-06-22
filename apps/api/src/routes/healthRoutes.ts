import { Router } from 'express';
import { HealthCheck } from '../controllers/healthController';

const router = Router();

router.get('/health', HealthCheck);

export default router;
