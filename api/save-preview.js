import jwt from 'jsonwebtoken';
import redis from '../lib/redis.js';
import sanitizeHtml from 'sanitize-html';
import { apiLimiter } from '../middleware/rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  await apiLimiter(req, res, async () => {
    const token = req.headers.cookie?.match(/token=([^;]+)/)?.[1];
    if (!token) return res.status(401).json({ error: 'Não autenticado' });

    try {
      const { email } = jwt.verify(token, process.env.JWT_SECRET);
      const { slug, title, description, image, affiliateLink } = req.body;

      if (!slug || !title || !description || !image || !affiliateLink) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(slug)) return res.status(400).json({ error: 'Slug inválido' });
      if (await redis.exists(`preview:${slug}`)) return res.status(409).json({ error: 'Slug já existe' });

      const credits = parseInt(await redis.get(`user:${email}:credits`) || '0');
      if (credits <= 0) return res.status(403).json({ error: 'Créditos insuficientes' });

      const previewData = {
        title: sanitizeHtml(title, { allowedTags: [] }),
        description: sanitizeHtml(description, { allowedTags: [] }),
        image: sanitizeHtml(image, { allowedTags: [] }),
        affiliateLink: sanitizeHtml(affiliateLink, { allowedTags: [] }),
      };

      await redis.multi()
        .setex(`preview:${slug}`, 30 * 24 * 60 * 60, JSON.stringify(previewData))
        .lpush(`user:${email}:history`, slug)
        .decr(`user:${email}:credits`)
        .exec();

      res.status(200).json({ success: true, url: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}` });
    } catch (err) {
      console.error('Erro ao salvar:', err);
      res.status(500).json({ error: 'Erro interno' });
    }
  });
                            }
