require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/pagamento', require('./routes/pagamento'));
app.use('/api/plataforma', require('./routes/plataforma'));
app.use('/api/igrejas', require('./routes/igrejas'));
app.use('/api/fieis', require('./routes/fieis'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log(`✅ É OHDIZIMO — Porta ${PORTA}`);
});
