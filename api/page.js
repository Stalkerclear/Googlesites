export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.end(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>MyLink - Login</title>
      <style>
        body {
          background-color: #000;
          color: #00ffcc;
          font-family: monospace;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .box {
          background: #111;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 0 10px #00ffaa66;
          width: 100%;
          max-width: 400px;
        }
        h1 {
          text-shadow: 0 0 10px #00ffcc;
          text-align: center;
        }
        input, button {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
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
        .error {
          color: #f44;
          text-align: center;
        }
        a {
          color: #00ffaa;
          text-decoration: none;
          display: block;
          text-align: center;
          margin-top: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>MyLink</h1>
        <form id="loginForm">
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Senha" required />
          <button type="submit">Entrar</button>
        </form>
        <p class="error" id="error"></p>
        <a href="/register">Criar conta</a>
      </div>
      <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const form = e.target;
          const data = { email: form.email.value, password: form.password.value };
          const error = document.getElementById('error');

          try {
            const res = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            const json = await res.json();
            if (json.success) {
              window.location.href = '/painel';
            } else {
              error.textContent = json.error || 'Erro ao fazer login';
            }
          } catch (err) {
            error.textContent = 'Erro de conexão';
          }
        });
      </script>
    </body>
    </html>
  `);
}
