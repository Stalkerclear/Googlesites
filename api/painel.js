import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const token = req.headers.cookie?.match(/token=([^;]+)/)?.[1];
  if (!token) {
    return res.status(403).send(`
      <html><body style="background:#000;color:#f55;font-family:monospace;text-align:center;padding-top:5rem;">
        <h1>Acesso Negado</h1>
        <p>Você precisa estar logado.</p>
        <a href="/" style="color:#0ff;">Voltar para login</a>
      </body></html>
    `);
  }

  let email;
  try {
    ({ email } = jwt.verify(token, process.env.JWT_SECRET));
  } catch (err) {
    return res.status(401).send('Token inválido');
  }

  res.setHeader('Content-Type', 'text/html');
  res.end(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Painel - MyLink</title>
      <style>
        body {
          background-color: #000;
          color: #00ffcc;
          font-family: monospace;
          padding: 2rem;
        }
        h1, h2 {
          text-shadow: 0 0 10px #00ffcc;
        }
        .box {
          background: #111;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 0 10px #00ffaa66;
          max-width: 700px;
          margin: 2rem auto;
        }
        input, button {
          width: 100%;
          padding: 12px;
          margin-top: 10px;
          font-size: 1rem;
          border: none;
          border-radius: 6px;
        }
        input {
          background-color: #000;
          color: #0f0;
          border: 2px solid #00ffcc;
        }
        input:focus {
          outline: none;
          box-shadow: 0 0 10px #00ffaa;
        }
        button {
          background-color: #00ffcc;
          color: #000;
          font-weight: bold;
          cursor: pointer;
        }
        .output, .history, .credits {
          margin-top: 2rem;
        }
        .history li {
          margin-bottom: 0.5rem;
        }
        .error {
          color: #f44;
        }
        a {
          color: #00ffaa;
        }
        #invoice {
          word-break: break-all;
          background: #222;
          padding: 1rem;
          border-radius: 6px;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <div style="text-align:right;"><a href="/logout" style="color:#f44;">[ Sair ]</a></div>
        <h1>Bem-vindo, ${email}</h1>
        <div class="credits">
          <h2>Créditos: <span id="credits">Carregando...</span></h2>
          <form id="addCreditsForm">
            <input type="number" name="amount" placeholder="Quantidade de créditos" min="1" required />
            <button type="submit">Adicionar Créditos</button>
          </form>
          <div id="invoice"></div>
        </div>
        <form id="previewForm">
          <input type="text" name="slug" placeholder="Final da URL" required />
          <input type="text" name="title" placeholder="Título" required />
          <input type="text" name="description" placeholder="Descrição" required />
          <input type="url" name="image" placeholder="URL da imagem" required />
          <input type="url" name="affiliateLink" placeholder="Link final" required />
          <button type="submit">Gerar Link</button>
        </form>
        <div class="output" id="output"></div>
        <div class="history">
          <h2>Seus últimos links</h2>
          <ul id="historyList" style="list-style:none;padding:0;"></ul>
        </div>
      </div>
      <script>
        async function loadCredits() {
          const res = await fetch('/api/check-credits');
          const json = await res.json();
          document.getElementById('credits').textContent = json.credits ?? 0;
        }

        async function loadHistory() {
          const res = await fetch('/api/history-user');
          const list = document.getElementById('historyList');
          list.innerHTML = '';
          if (res.ok) {
            const json = await res.json();
            json.forEach(link => {
              const li = document.createElement('li');
              const a = document.createElement('a');
              a.href = link.url;
              a.textContent = link.url;
              a.style.color = '#0f0';
              a.target = '_blank';
              li.appendChild(a);
              list.appendChild(li);
            });
          }
        }

        document.getElementById('previewForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const form = e.target;
          const button = form.querySelector('button');
          button.disabled = true;
          button.textContent = 'Gerando...';
          const data = {
            slug: form.slug.value,
            title: form.title.value,
            description: form.description.value,
            image: form.image.value,
            affiliateLink: form.affiliateLink.value,
          };
          const output = document.getElementById('output');

          try {
            const res = await fetch('/api/save-preview', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            const json = await res.json();
            if (json.success) {
              output.innerHTML = \`<p>Link gerado: <a href="\${json.url}" target="_blank">\${json.url}</a></p>\`;
              loadCredits();
              loadHistory();
            } else {
              output.innerHTML = \`<p class="error">Erro: \${json.error || 'desconhecido'}</p>\`;
            }
          } catch (err) {
            output.innerHTML = '<p class="error">Erro de conexão</p>';
          } finally {
            button.disabled = false;
            button.textContent = 'Gerar Link';
          }
        });

        document.getElementById('addCreditsForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const form = e.target;
          const button = form.querySelector('button');
          button.disabled = true;
          button.textContent = 'Gerando Invoice...';
          const data = { amount: parseInt(form.amount.value) };
          const invoiceDiv = document.getElementById('invoice');

          try {
            const res = await fetch('/api/add-credits', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            const json = await res.json();
            if (json.success) {
              invoiceDiv.innerHTML = \`
                <p>Pague com BlueWallet:</p>
                <p id="invoiceText">\${json.invoice}</p>
                <button onclick="checkPayment('\${json.invoice}')">Verificar Pagamento</button>
              \`;
              startPaymentCheck(json.invoice);
            } else {
              invoiceDiv.innerHTML = \`<p class="error">Erro: \${json.error || 'desconhecido'}</p>\`;
            }
          } catch (err) {
            invoiceDiv.innerHTML = '<p class="error">Erro de conexão</p>';
          } finally {
            button.disabled = false;
            button.textContent = 'Adicionar Créditos';
          }
        });

        async function checkPayment(invoice) {
          try {
            const res = await fetch('/api/check-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ payment_hash: invoice.split('@')[0] }),
            });
            const json = await res.json();
            if (json.success) {
              alert(\`Pagamento confirmado! Novos créditos: \${json.newCredits}\`);
              document.getElementById('invoice').innerHTML = '';
              loadCredits();
            } else if (json.message) {
              console.log(json.message);
            }
          } catch (err) {
            console.error('Erro ao verificar:', err);
          }
        }

        function startPaymentCheck(invoice) {
          const interval = setInterval(async () => {
            await checkPayment(invoice);
          }, 10000); // Checa a cada 10s
          setTimeout(() => clearInterval(interval), 3600000); // Para após 1h
        }

        loadCredits();
        loadHistory();
      </script>
    </body>
    </html>
  `);
}
