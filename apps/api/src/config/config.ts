import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
const clientId = process.env.CLIENT_ID;
const baseUrl = process.env.BASE_URL;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = `${baseUrl}/callback`;
const spotifyAPIBaseUrl = 'https://api.spotify.com/v1';

export { app, port, clientId, clientSecret, redirectUri, spotifyAPIBaseUrl };
