const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') || process.env.DATABASE_URL?.includes('render.com')
    ? { rejectUnauthorized: false }
    : false
});

pool.connect((err) => {
  if (err) {
    console.error('❌ Banco NÃO conectado:', err.message);
  } else {
    console.log('✅ Banco conectado com sucesso!');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
