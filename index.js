import express from "express";
const app = express();

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

app.get("/", (req, res) => {
  const rawRedirectUrl = req.query.url || "https://correiodeminas.com.br/2024/04/01/15-paises-do-mundo-que-te-pagam-para-morar-la/";
  const redirectUrl = isValidUrl(rawRedirectUrl) ? rawRedirectUrl : "https://google.com";
  const affiliateLink = process.env.AFFILIATE_LINK || "https://s.shopee.com.br/9AAf7QAg6q";
  const sources = ["utm_source=facebook"];
  const utm = sources[0];
  const fullLink = `${affiliateLink}&${utm}`;

  const baitData = [
    { 
      title: "15 Países do Mundo que te Pagam para Morar Lá", 
      desc: "Descubra quais países oferecem dinheiro para você viver neles!", 
      img: "https://correiodeminas.com.br/wp-content/uploads/2024/04/paises-que-pagam-para-morar.jpg", 
      url: redirectUrl 
    }
  ];
  const bait = baitData[0];

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${bait.title}</title>
      <meta name="referrer" content="no-referrer">
      <meta property="og:title" content="${bait.title}">
      <meta property="og:description" content="${bait.desc}">
      <meta property="og:image" content="${bait.img}">
      <meta property="og:url" content="${bait.url}">
    </head>
    <body>
      <div>Redirecionando...</div>
      <script>
        if (!localStorage.getItem('shopeeClicked')) {
          window.location.href = "${fullLink}"; // Redireciona direto pra Shopee
          localStorage.setItem('shopeeClicked', 'true');
          document.cookie = "shopee_affiliate=9AAf7QAg6q; path=/; expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()}";
          setTimeout(() => { window.location.href = "${decodeURIComponent(redirectUrl)}"; }, 2000); // 2s pra matéria
        } else {
          window.location.href = "${decodeURIComponent(redirectUrl)}";
        }
      </script>
    </body>
    </html>
  `;
  console.log(`Clique registrado - IP: ${req.ip}, Hora: ${new Date()}, Destino: ${redirectUrl}`);
  res.send(html);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Rodando na porta ${port}`));

export default app;
