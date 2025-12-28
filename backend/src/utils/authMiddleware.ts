import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/supabaseClient';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');
  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }
  const { user, error } = await verifyAccessToken(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  (req as any).user = user;
  next();
}
