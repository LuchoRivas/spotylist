import { Request, Response } from 'express';

export function HealthCheck (req: Request, res: Response) {
  res.status(200).send('¡Hola, mundo!');
};
