const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

function gerarLinkUnico(nome) {
  return nome.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Math.random().toString(36).slice(2, 8);
}

router.post('/cadastro', async (req, res) => {
  try {
    const { nome, cnpj, endereco, telefone, email, senha, valor_dizimo_fixo, data_vencimento_dia, chave_pix, sumup_merchant_id, sumup_api_key } = req.body;
    
    const senha_hash = await bcrypt.hash(senha, 10);
    const link_unico = gerarLinkUnico(nome);

    const resu = await db.query(`
      INSERT INTO igrejas(
        nome, cnpj, endereco, telefone, email, senha_hash,
        valor_dizimo_fixo, data_vencimento_dia, chave_pix,
        sumup_merchant_id, sumup_api_key, link_unico
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, link_unico, nome
    `, [nome, cnpj, endereco, telefone, email, senha_hash, valor_dizimo_fixo, data_vencimento_dia, chave_pix, sumup_merchant_id, sumup_api_key, link_unico]);

    res.json({ sucesso: true, dados: resu.rows[0] });
  } catch (erro) {
    res.status(400).json({ sucesso: false, erro: erro.message });
  }
});

router.get('/lista', async (req, res) => {
  try {
    const lista = await db.query('SELECT id, nome, cidade, ativo, criado_em FROM igrejas ORDER BY nome');
    res.json(lista.rows);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
