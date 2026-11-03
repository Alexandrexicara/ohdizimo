const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_URL?.includes('neon.tech') ||
    process.env.DATABASE_URL?.includes('render.com')
      ? { rejectUnauthorized: false }
      : false,
  // Evita manter uma conexão reservada permanentemente.
  // O pool administra e renova conexões conforme necessário.
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  keepAlive: true
});

// Conexões ociosas podem ser encerradas pelo PostgreSQL/provedor.
// Tratar o evento do pool impede que uma desconexão isolada derrube o Node.
pool.on('error', (err) => {
  console.error('⚠️ Conexão ociosa do PostgreSQL encerrada:', err.message);
});

// Verificação inicial sem retirar um Client do pool.
// A consulta libera automaticamente a conexão ao terminar.
pool.query('SELECT 1')
  .then(() => {
    console.log('✅ Banco conectado com sucesso!');
  })
  .catch((err) => {
    console.error('❌ Banco ainda não disponível:', err.message);
  });

module.exports = {
  query: (text, params) => pool.query(text, params)
};
