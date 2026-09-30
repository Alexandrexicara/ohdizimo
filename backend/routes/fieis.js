const express = require('express');
const router = express.Router();
const db = require('../config/db');

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
