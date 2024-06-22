import { app } from './config/config';
import authRoutes from './routes/authRoutes';
import healthRoutes from './routes/healthRoutes';
import playlistRoutes from './routes/playlistRoutes';

app.use(healthRoutes);

app.use(authRoutes);
app.use(playlistRoutes);

export default app;
