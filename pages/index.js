
// pages/index.js
export default function Index() {
  return (
    <div style={{ color: "#0f0", background: "#000", fontFamily: "monospace", padding: "2rem" }}>
      <h1>Redirecionando...</h1>
      <script dangerouslySetInnerHTML={{
        __html: `
          setTimeout(() => {
            window.location.href = '/painel';
          }, 10);
        `
      }} />
    </div>
  );
}
