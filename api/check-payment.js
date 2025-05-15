import axios from 'axios';
import redis from '../lib/redis.js';
import { apiLimiter } from '../middleware/rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  await apiLimiter(req, res, async () => {
    const { payment_hash } = req.body;

    if (!payment_hash) return res.status(400).json({ error: 'Payment hash não informado' });

    try {
      // Verifica status do invoice no LNbits
      const paymentStatus = await axios.get(
        `${process.env.LNBITS_URL}/api/v1/payments/${payment_hash}`,
        {
          headers: {
            'X-Api-Key': process.env.LNBITS_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (paymentStatus.data.paid) {
        const invoiceData = await redis.get(`invoice:${payment_hash}`);
        if (!invoiceData) return res.status(404).json({ error: 'Invoice não encontrado' });

        const { email, amount } = JSON.parse(invoiceData);
        const credits = parseInt(await redis.get(`user:${email}:credits`) || '0');
        await redis.set(`user:${email}:credits`, credits + amount);
        await redis.del(`invoice:${payment_hash}`); // Remove invoice após crédito

        res.status(200).json({ success: true, newCredits: credits + amount });
      } else {
        res.status(202).json({ success: false, message: 'Pagamento pendente' });
      }
    } catch (err) {
      console.error('Erro ao verificar pagamento:', err);
      res.status(500).json({ error: 'Erro interno' });
    }
  });
}
