const express = require('express');
const router = express.Router();
const { cadastrar, buscarPorLink, listarTodas } = require('../controllers/igrejaController');

router.post('/cadastro', async (req, res) => {
  try {
    const igreja = await cadastrar(req.body);
    res.json({ sucesso: true, dados: igreja });
  } catch (erro) {
    res.status(400).json({ sucesso: false, erro: erro.message });
  }
});

router.get('/link/:link', async (req, res) => {
  const igreja = await buscarPorLink(req.params.link);
  if (igreja) res.json({ sucesso: true, igreja });
  else res.status(404).json({ erro: 'Igreja não encontrada' });
});

router.get('/lista', async (req, res) => {
  try {
    const lista = await listarTodas();
    res.json(lista);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
