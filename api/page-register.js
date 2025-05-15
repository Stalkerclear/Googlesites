export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.end(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>MyLink - Registro</title>
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
        <h1>Criar Conta</h1>
        <form id="registerForm">
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Senha" required />
          <button type="submit">Registrar</button>
        </form>
        <p class="error" id="error"></p>
        <a href="/">Já tem conta? Faça login</a>
      </div>
      <script>
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const form = e.target;
          const data = { email: form.email.value, password: form.password.value };
          const error = document.getElementById('error');

          try {
            const res = await fetch('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            const json = await res.json();
            if (json.success) {
              window.location.href = '/';
            } else {
              error.textContent = json.error || 'Erro ao registrar';
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
