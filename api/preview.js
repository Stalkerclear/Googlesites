import redis from '../lib/redis.js';
import sanitizeHtml from 'sanitize-html';

export default async function handler(req, res) {
  const { id: slug } = req.query;
  if (!slug) return res.status(400).send('Slug não informado');

  const data = await redis.get(`preview:${slug}`);
  if (!data) {
    return res.status(404).send(`
      <html><body style="background:#000;color:#f55;font-family:monospace;text-align:center;">
        <h1>Link Não Encontrado</h1>
        <p>O link que você acessou não existe.</p>
        <a href="/" style="color:#0ff;">Voltar</a>
      </body></html>
    `);
  }

  const { title, description, image, affiliateLink } = JSON.parse(data);
  const cleanTitle = sanitizeHtml(title, { allowedTags: [] });
  const cleanDescription = sanitizeHtml(description, { allowedTags: [] });
  const cleanImage = sanitizeHtml(image, { allowedTags: [] });
  const cleanAffiliateLink = sanitizeHtml(affiliateLink, { allowedTags: [] });

  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${cleanTitle}</title>
      <meta property="og:title" content="${cleanTitle}">
      <meta property="og:description" content="${cleanDescription}">
      <meta property="og:image" content="${cleanImage}">
      <meta property="og:url" content="${process.env.NEXT_PUBLIC_BASE_URL}/${slug}">
      <meta property="og:type" content="website">
      <meta name="twitter:card" content="summary_large_image">
      <noscript>
        <meta http-equiv="refresh" content="3;url=${cleanAffiliateLink}">
      </noscript>
    </head>
    <body style="background:#fff;color:#000;text-align:center;padding:2rem;">
      <h2>Carregando...</h2>
      <script>
        setTimeout(() => {
          window.location.href = "${cleanAffiliateLink}";
        }, 3000);
      </script>
    </body>
    </html>
  `);
}
