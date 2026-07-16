import { useEffect } from 'react';

/** Root React entry is retired — Ad Production lives at /studio.html. */
export default function App() {
  useEffect(() => {
    window.location.replace('/studio.html');
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0B1F3A',
        color: '#e2e8f0',
        fontFamily: '"Be Vietnam", Inter, Arial, sans-serif',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div>
        <p style={{ marginBottom: '1rem', color: '#9DB6C6' }}>Opening Ad Production…</p>
        <a href="/studio.html" style={{ color: '#00B2E2', fontWeight: 700 }}>
          Dashboard
        </a>
      </div>
    </div>
  );
}
