import express from "express";
const app = express();

app.get("/", (req, res) => {
  const affiliateLink = "https://s.shopee.com.br/5VHOGDvzdX";
  const fullLink = `${affiliateLink}&utm_source=facebook`;
  const title = req.query.title || "Bebê de Virgínia Fonseca José Leonardo foi internado devido bronquiolite";
  const desc = req.query.desc || "Descubra quais países oferecem dinheiro para você viver neles!"; // Posso ajustar a descrição, se quiser
  const img = "https://static1.purepeople.com.br/articles/2/33/16/92/@/3755964-maria-alice-filha-de-virginia-fonseca-e-580x0-3.jpg"; // Imagem da Virgínia
  const baitUrl = "https://shopee.com.br";

  const userAgent = req.headers["user-agent"] || "";
  const isCrawler = /facebookexternalhit|Facebot|WhatsApp|Twitterbot|LinkedInBot|Slackbot|Vercel/i.test(userAgent);

  if (isCrawler) {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <meta name="referrer" content="no-referrer">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${desc}">
        <meta property="og:image" content="${img}">
        <meta property="og:url" content="${baitUrl}">
        <meta property="og:type" content="website">
      </head>
      <body><h1>${title}</h1><p>${desc}</p></body>
      </html>
    `);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <meta name="referrer" content="no-referrer">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${desc}">
        <meta property="og:image" content="${img}">
        <meta property="og:url" content="${baitUrl}">
      </head>
      <body>
        <div>Abrindo oferta especial...</div>
        <script>
          window.location.href = "${fullLink}";
          document.cookie = "shopee_affiliate=5VHOGDvzdX; path=/; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}";
        </script>
      </body>
      </html>
    `);
    console.log(`Clique - IP: ${req.ip}, Hora: ${new Date()}`);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Rodando na porta ${port}`));

export default app;
