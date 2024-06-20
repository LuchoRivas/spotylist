import authRoutes from './routes/authRoutes';
import playlistRoutes from './routes/playlistRoutes';
import { app } from './config/config';
import healthRoutes from './routes/healthRoutes';

app.use(authRoutes);
app.use(playlistRoutes);
app.use(healthRoutes);

export default app;
