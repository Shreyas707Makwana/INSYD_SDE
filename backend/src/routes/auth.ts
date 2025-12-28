import { Router } from 'express';
import { verifyAccessToken } from '../services/supabaseClient';

const router = Router();

router.post('/verify', async (req, res) => {
  const token = req.body?.token as string;
  if (!token) return res.status(400).json({ error: 'token is required' });
  const { user, error } = await verifyAccessToken(token);
  if (error || !user) return res.status(401).json({ error: 'invalid token' });
  return res.json({ user });
});

export default router;
