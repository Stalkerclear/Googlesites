import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redis from '../lib/redis.js';
import { apiLimiter } from '../middleware/rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  await apiLimiter(req, res, async () => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

    try {
      // Checa no Redis primeiro
      const userData = await redis.get(`user:${email}`);
      if (userData) {
        const user = JSON.parse(userData);
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: 'Senha incorreta' });

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`);
        return res.status(200).json({ success: true });
      }

      // Fallback pro USERS do .env
      const users = process.env.USERS?.split(',').reduce((acc, user) => {
        const [username, pass] = user.split(':');
        acc[username] = pass;
        return acc;
      }, {});
      if (users && users[email] && users[email] === password) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`);
        // Inicializa usuário no Redis com 5 créditos
        await redis.set(`user:${email}`, JSON.stringify({ email, password: await bcrypt.hash(password, 10), credits: 5 }));
        return res.status(200).json({ success: true });
      }

      return res.status(401).json({ error: 'Usuário não encontrado' });
    } catch (err) {
      console.error('Erro no login:', err);
      res.status(500).json({ error: 'Erro interno' });
    }
  });
}
