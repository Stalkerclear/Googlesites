import jwt from 'jsonwebtoken';
import redis from '../lib/redis.js';

export default async function handler(req, res) {
  const token = req.headers.cookie?.match(/token=([^;]+)/)?.[1];
  if (!token) return res.status(401).json({ error: 'Não autenticado' });

  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const slugs = await redis.lrange(`user:${email}:history`, 0, 9);
    const links = slugs.map(slug => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`,
      slug,
    }));
    res.status(200).json(links);
  } catch (err) {
    console.error('Erro ao carregar histórico:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}
