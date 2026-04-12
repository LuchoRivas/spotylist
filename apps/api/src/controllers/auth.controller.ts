import { Request, Response } from 'express';
import querystring from 'querystring';
import { generateRandomString } from '@spotylist/common';
import { env } from '../config/env.config';
import {
  exchangeCodeForTokens,
  getUserProfile,
  refreshAccessToken,
} from '../services/spotify.service';

export async function login(_req: Request, res: Response) {
  const state = generateRandomString(16);
  const scope =
    'user-read-private user-read-email playlist-read-private playlist-read-collaborative';

  const authUrl = `${env.spotifyAccountsUrl}/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: env.clientId,
    scope,
    redirect_uri: env.redirectUri,
    state,
  })}`;

  res.json({ authUrl });
}

export async function callback(req: Request, res: Response) {
  const { code, state } = req.query;

  if (!state) {
    res.status(400).json({ error: 'state_mismatch' });
    return;
  }

  const tokens = await exchangeCodeForTokens(code as string);
  const user = await getUserProfile(tokens.access_token);

  res.json({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    user,
  });
}

export async function refreshToken(req: Request, res: Response) {
  const { refresh_token } = req.query;
  const access_token = await refreshAccessToken(refresh_token as string);
  res.json({ access_token });
}
