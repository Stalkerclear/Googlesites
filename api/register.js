import bcrypt from 'bcryptjs';
import redis from '../lib/redis.js';
import { apiLimiter } from '../middleware/rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  await apiLimiter(req, res, async () => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email inválido' });
    if (password.length < 6) return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });

    try {
      const exists = await redis.get(`user:${email}`);
      if (exists) return res.status(409).json({ error: 'Usuário já existe' });

      const hashedPassword = await bcrypt.hash(password, 10);
      await redis.set(`user:${email}`, JSON.stringify({ email, password: hashedPassword, credits: 5 }));
      res.status(201).json({ success: true });
    } catch (err) {
      console.error('Erro no registro:', err);
      res.status(500).json({ error: 'Erro interno' });
    }
  });
}
