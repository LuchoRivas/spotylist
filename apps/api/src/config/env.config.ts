import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  clientId: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',
  baseUrl: process.env.BASE_URL || 'http://127.0.0.1:3000',
  get redirectUri() {
    return `${this.baseUrl}/callback`;
  },
  get basicAuth() {
    return Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
  },
  spotifyApiBaseUrl: 'https://api.spotify.com/v1',
  spotifyAccountsUrl: 'https://accounts.spotify.com',
};
