import jwt from 'jsonwebtoken';
import redis from '../lib/redis.js';

export default async function handler(req, res) {
  const token = req.headers.cookie?.match(/token=([^;]+)/)?.[1];
  if (!token) return res.status(401).json({ error: 'Não autenticado' });

  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const credits = parseInt(await redis.get(`user:${email}:credits`) || '0');
    res.status(200).json({ credits });
  } catch (err) {
    console.error('Erro ao verificar créditos:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}
