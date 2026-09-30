const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Para o admin ver todos
router.get('/lista', async (req, res) => {
  try {
    const resu = await db.query(
      'SELECT f.id, f.nome, f.telefone, f.criado_em, i.nome as igreja_nome FROM fieis f LEFT JOIN igrejas i ON f.igreja_id = i.id ORDER BY f.nome'
    );
    res.json(resu.rows);
  } catch (erro) {
    console.log('Erro fiéis:', erro.message);
    res.status(500).json({ erro: erro.message });
  }
});

// Para uma igreja específica
router.get('/lista/:igreja_id', async (req, res) => {
  try {
    const resu = await db.query(
      'SELECT id, nome, telefone, criado_em FROM fieis WHERE igreja_id=$1 ORDER BY nome',
      [req.params.igreja_id]
    );
    res.json(resu.rows);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
