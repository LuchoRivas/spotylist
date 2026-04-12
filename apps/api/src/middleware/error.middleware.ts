import { Request, Response, NextFunction } from 'express';
import { AxiosError } from 'axios';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AxiosError) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || err.message;
    console.error(`Spotify API error [${status}]: ${message}`);
    res.status(status).json({ error: message });
    return;
  }

  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Internal server error' });
}
