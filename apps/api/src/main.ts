import express from 'express';
import cors from 'cors';
import { env } from './config/env.config';
import authRoutes from './routes/auth.routes';
import playlistRoutes from './routes/playlist.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('¡Hola, mundo!');
});

app.use(authRoutes);
app.use(playlistRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Servidor en ejecución en el puerto ${env.port}`);
});
