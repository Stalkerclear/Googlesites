import express from "express";
const app = express();

app.get("/", (req, res) => {
  const affiliateLink = "https://s.shopee.com.br/5VHOGDvzdX";
  const fullLink = `${affiliateLink}&utm_source=facebook`;
  const title = req.query.title || "Mulher de São Gotardo MG empreende e fica rica com o digital"; // Novo título
  const desc = req.query.desc || "Descubra quais países oferecem dinheiro para você viver neles!";
  const img = "https://i.imgur.com/704oFGn.jpeg";
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
        <meta property="og:type" content="website
