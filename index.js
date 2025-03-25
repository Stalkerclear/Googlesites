import express from "express";
const app = express();

app.get("/", (req, res) => {
  const affiliateLink = "https://s.shopee.com.br/5VHOGDvzdX";
  const sources = ["utm_source=facebook"];
  const utm = sources[0];
  const fullLink = `${affiliateLink}&${utm}`;

  const title = req.query.title || "Ofertas Imperdíveis de Páscoa na Shopee!";
  const desc = req.query.desc || "Aproveite descontos incríveis nesta Páscoa!";
  const img = "https://correiodeminas.com.br/wp-content/uploads/2024/04/paises-que-pagam-para-morar.jpg";
  const baitUrl = "https://shopee.com.br";

  const userAgent = req.headers["user-agent"] || "";
  const isCrawler = /facebookexternalhit|Facebot|WhatsApp|Twitterbot|LinkedInBot|Slackbot|Vercel/i.test(userAgent);

  if (isCrawler) {
    const html = `
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
      <body>
        <h1>${title}</h1>
        <p>${desc}</p>
      </body>
      </html>
    `;
    res.send(html);
  } else {
    const html = `
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
    `;
    console.log(`Clique registrado - IP: ${req.ip}, Hora: ${new Date()}`);
    res.send(html);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Rodando na porta ${port}`));

export default app;
