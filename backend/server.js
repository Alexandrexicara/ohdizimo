require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Todas as rotas
app.use('/api/igrejas', require('./routes/igrejas'));
app.use('/api/fieis', require('./routes/fieis'));
app.use('/api/pagamentos', require('./routes/pagamentos'));
app.use('/api/sumup', require('./routes/sumup'));
app.use('/api/plataforma', require('./routes/plataforma'));

// Páginas
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/public/index.html')));
app.get('/igreja/cadastro', (req, res) => res.sendFile(path.join(__dirname, '../frontend/pages/igreja/cadastro.html')));
app.get('/fiel/cadastro', (req, res) => res.sendFile(path.join(__dirname, '../frontend/pages/fiel/cadastro.html')));
app.get('/fiel/cadastro/:link', (req, res) => res.sendFile(path.join(__dirname, '../frontend/pages/fiel/cadastro.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '../frontend/pages/plataforma/dashboard.html')));

app.get('/health', (req, res) => res.send('OK'));

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log(`✅ É OHDISMO → Porta ${PORTA}`));
