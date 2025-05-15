import jwt from 'jsonwebtoken';
import redis from '../lib/redis.js';

export default async function handler(req, res) {
  const token = req.headers.cookie?.match(/token=([^;]+)/)?.[1];
  if (!token) return res.status(401).json({ error: 'Não autenticado' });

  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const key = `user:${email}:slugs`;
    const count = await redis.scard(key);
    const max = parseInt(process.env.MAX_SLUGS || '3');
    res.status(200).json({ count, max });
  } catch (err) {
    console.error('Erro ao verificar slugs:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}
