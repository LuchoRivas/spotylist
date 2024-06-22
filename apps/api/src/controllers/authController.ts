import { Request, Response } from 'express';
import querystring from 'querystring';
import request from 'request';
import {
  clientId,
  clientSecret,
  redirectUri,
  spotifyAPIBaseUrl,
} from '../config/config';
import { generateRandomString } from '../utils/utils';

export function Login(req: Request, res: Response) {
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
}

export function Callback(req: Request, res: Response) {
  const { code, state } = req.query || null;

  if (state === null) {
    res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
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

        request.get(options, (error, response, userData) => {
          if (!error && response.statusCode === 200) {
            res.status(200).json({
              access_token: access_token,
              refresh_token: refresh_token,
              user: userData,
            });
          } else {
            res.status(response.statusCode).json({ error: 'user_data_error' });
          }
        });
      } else {
        res.status(response.statusCode).json({ error: 'invalid_token' });
      }
    });
  }
}

export function RefreshToken(req: Request, res: Response) {
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

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({ access_token: access_token });
    }
  });
}
