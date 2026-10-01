require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Pasta public → index.html, css, js
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Pasta pages → TODAS as páginas: fiel/, igreja/, plataforma/
app.use(express.static(path.join(__dirname, '../frontend/pages')));

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// APIs
app.use('/api/pagamento', require('./routes/pagamento'));
app.use('/api/plataforma', require('./routes/plataforma'));
app.use('/api/igrejas', require('./routes/igrejas'));
app.use('/api/fieis', require('./routes/fieis'));

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log(`✅ É OHDIZIMO — Porta ${PORTA}`);
});
