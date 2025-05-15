import jwt from 'jsonwebtoken';
import redis from '../lib/redis.js';
import axios from 'axios';
import { apiLimiter } from '../middleware/rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  await apiLimiter(req, res, async () => {
    const token = req.headers.cookie?.match(/token=([^;]+)/)?.[1];
    if (!token) return res.status(401).json({ error: 'Não autenticado' });

    try {
      const { email } = jwt.verify(token, process.env.JWT_SECRET);
      const { amount } = req.body;

      if (!amount || amount < 1) return res.status(400).json({ error: 'Quantidade inválida' });

      // Gera invoice Lightning via LNbits
      const invoiceResponse = await axios.post(
        `${process.env.LNBITS_URL}/api/v1/payments`,
        {
          out: false,
          amount: amount * 1000, // Converte créditos pra satoshis (1 crédito = 1000 sats)
          memo: `Adição de ${amount} créditos para ${email}`,
        },
        {
          headers: {
            'X-Api-Key': process.env.LNBITS_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const { payment_request: invoice, payment_hash } = invoiceResponse.data;

      // Armazena invoice no Redis pra verificação posterior
      await redis.setex(`invoice:${payment_hash}`, 3600, JSON.stringify({ email, amount }));

      // Retorna invoice pro cliente pagar via BlueWallet
      res.status(200).json({ success: true, invoice });
    } catch (err) {
      console.error('Erro ao gerar invoice:', err);
      res.status(500).json({ error: 'Erro ao processar pagamento' });
    }
  });
}
