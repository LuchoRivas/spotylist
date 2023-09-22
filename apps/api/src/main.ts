import express from 'express';
import querystring from 'querystring';
import cors from 'cors';
import dotenv from 'dotenv';
import request from 'request';
import { filterUserPlaylists } from './utils';
import {
  generateRandomString,
  SpotifyPlaylist,
  SpotifyPlaylistResponse,
  SpotifyPlaylistTrackResponse,
} from '@spotylist/common';

const app = express();
// Habilitar CORS
app.use(cors());
// Habilitar env
dotenv.config();

const port = process.env.PORT || 3000;
const clientId = process.env.CLIENT_ID;
const baseUrl = process.env.BASE_URL;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = `${baseUrl}/callback`;
const spotifyAPIBaseUrl = 'https://api.spotify.com/v1';

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  const scope =
    'user-read-private user-read-email playlist-read-private playlist-read-collaborative';

  try {
    const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify(
      {
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state,
      }
    )}`;

    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ Error: error });
    console.error(error);
  }
});

app.get('/callback', (req, res) => {
  const { code, state } = req.query || null;

  if (state === null) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    );
  } else {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      },
      json: true,
    };
    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token,
          refresh_token = body.refresh_token;

        const options = {
          url: `${spotifyAPIBaseUrl}/me`,
          headers: { Authorization: 'Bearer ' + access_token },
          json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, (error, response, userData) => {
          if (!error && response.statusCode === 200) {
            // Combine user data with tokens and send it to the frontend
            res.status(200).json({
              access_token: access_token,
              refresh_token: refresh_token,
              user: userData, // Include user data in the response
            });
          } else {
            // Handle errors when fetching user data
            res.status(response.statusCode).json({
              error: 'user_data_error',
            });
          }
        });
      } else {
        // Send an error response as JSON to the frontend
        res.status(response.statusCode).json({
          error: 'invalid_token',
        });
      }
    });
  }
});

app.get('/user-playlists', (req: any, res: any) => {
  try {
    const { userId } = req.query || '';
    const limit = 50;
    let offset = 0;
    const playlists: SpotifyPlaylist[] = []; // playlists filtradas

    const fetchPlaylists = () => {
      const options = {
        url: `${spotifyAPIBaseUrl}/users/${userId}/playlists?limit=${limit}&offset=${offset}`,
        headers: { Authorization: req.headers.authorization },
        json: true,
      };

      request.get(
        options,
        (error, response, userplaylistsData: SpotifyPlaylistResponse) => {
          if (!error && response.statusCode === 200) {
            const filteredPlaylists = filterUserPlaylists(
              userplaylistsData,
              userId
            );
            playlists.push(...filteredPlaylists);

            // si hay mas playlists para recuperar
            if (userplaylistsData.total > limit + offset) {
              offset += limit;
              fetchPlaylists(); // siguiente página de playlists
            } else {
              res.status(200).json({ playlists });
            }
          } else if (
            userplaylistsData.error?.status === 401 &&
            userplaylistsData.error?.message === 'The access token expired'
          ) {
            // Token de acceso expirado
            res.status(401).json({ error: 'Token expired' });
          } else {
            // Manejar errores de la solicitud a la API de Spotify
            res.status(response.statusCode || 500).json({ Error: error });
            console.error(error);
          }
        }
      );
    };

    // Iniciar el proceso de recuperación de playlists
    fetchPlaylists();
  } catch (error) {
    res.status(500).json({ Error: error });
    console.error(error);
  }
});

app.get('/playlist-tracks', (req: any, res: any) => {
  try {
    const { playlistId } = req.query || '';
    const fetchPlaylist = () => {
      const options = {
        url: `${spotifyAPIBaseUrl}/playlists/${playlistId}/tracks`,
        headers: { Authorization: req.headers.authorization },
        json: true,
      };

      request.get(
        options,
        (error, response, playlistTracks: SpotifyPlaylistTrackResponse) => {
          if (!error && response.statusCode === 200) {
            // Manage tracks response playlistTracks
          }
          res.status(200).json({ message: 'playlist-tracks endpoint' });
        }
      );
    };
    fetchPlaylist();
  } catch (error) {
    res.status(500).json({ Error: error });
    console.error(error);
  }
});

app.get('/refresh_token', function (req, res) {
  // requesting access token from refresh token
  const { refresh_token } = req.query;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64'),
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('bodyr efresh_token ', body);

      const access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
