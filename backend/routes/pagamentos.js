const express = require('express');
const router = express.Router();
const { criarPagamento } = require('../controllers/pagamentoController');

router.post('/novo', async (req, res) => {
  try {
    res.json(await criarPagamento(req.body));
  } catch (erro) {
    res.status(400).json({ sucesso: false, erro: erro.message });
  }
});

module.exports = router;
