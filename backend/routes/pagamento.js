const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const TAXA_PADRAO = 5.00; // %

// 1️⃣ Fiel inicia — paga taxa primeiro
router.post('/iniciar', async (req, res) => {
  try {
    const { nome, telefone, igreja_id, valor_dizimo } = req.body;
    const valor = Number(valor_dizimo);
    
    if (!valor || valor <= 0) {
      return res.status(400).json({ erro: 'Valor do dízimo inválido' });
    }

    const valorTaxa = Number((valor * TAXA_PADRAO / 100).toFixed(2));
    const ref = `TAXA-${Date.now()}-${Math.floor(Math.random()*9999)}`;

    // Pegar dados da igreja
    const igreja = await pool.query(
      'SELECT nome, chave_pix FROM igrejas WHERE id = $1', [igreja_id]
    );

    await pool.query(`
      INSERT INTO pagamentos_taxa 
      (referencia, fiel_nome, fiel_telefone, igreja_id, valor_taxa_plataforma, valor_dizimo, chave_pix_igreja)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [ref, nome, telefone, igreja_id, valorTaxa, valor, igreja.rows[0]?.chave_pix || '']);

    res.json({
      sucesso: true,
      referencia: ref,
      valorTaxa: valorTaxa,
      valorDizimo: valor,
      taxaPercentual: TAXA_PADRAO,
      igrejaNome: igreja.rows[0]?.nome || 'Igreja',
      mensagem: '✅ Pague a taxa primeiro → depois será liberado o PIX da igreja'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: e.message });
  }
});

// 2️⃣ Webhook — confirma que taxa foi recebida
router.post('/webhook-taxa', async (req, res) => {
  try {
    const { status, reference } = req.body;
    
    if (status === 'PAID' || status === 'SUCCESS') {
      await pool.query(`
        UPDATE pagamentos_taxa 
        SET taxa_paga = true, data_pagamento_taxa = NOW(), status = 'taxa_confirmada'
        WHERE referencia = $1
      `, [reference]);
      console.log('✅ TAXA CONFIRMADA — Dízimo liberado:', reference);
    }
    
    res.sendStatus(200);
  } catch (e) {
    console.error('Erro webhook:', e);
    res.sendStatus(500);
  }
});

// 3️⃣ Verificar status — a taxa foi paga?
router.get('/status/:ref', async (req, res) => {
  const { ref } = req.params;
  const result = await pool.query(
    'SELECT * FROM pagamentos_taxa WHERE referencia = $1', [ref]
  );
  
  if (result.rows.length === 0) {
    return res.status(404).json({ erro: 'Não encontrado' });
  }

  res.json(result.rows[0]);
});

// 4️⃣ Fiel confirma que pagou o dízimo à igreja
router.post('/confirmar-dizimo', async (req, res) => {
  const { referencia } = req.body;
  
  await pool.query(`
    UPDATE pagamentos_taxa 
    SET dizimo_pago = true, data_pagamento_dizimo = NOW(), status = 'concluido'
    WHERE referencia = $1
  `, [referencia]);

  res.json({ sucesso: true, mensagem: '✅ Dízimo registrado! A igreja será notificada.' });
});

// 5️⃣ Igrejas veem quem enviou
router.get('/igreja/registros/:igreja_id', async (req, res) => {
  const { igreja_id } = req.params;
  const result = await pool.query(`
    SELECT referencia, fiel_nome, fiel_telefone, valor_dizimo, taxa_paga, dizimo_pago, criado_em
    FROM pagamentos_taxa 
    WHERE igreja_id = $1 
    ORDER BY criado_em DESC
  `, [igreja_id]);
  
  res.json(result.rows);
});

module.exports = router;
