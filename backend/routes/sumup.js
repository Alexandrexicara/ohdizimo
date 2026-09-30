const express = require('express');
const router = express.Router();
const { processarWebhookSumUp } = require('../controllers/pagamentoController');

router.post('/webhook', async (req, res) => {
  try {
    await processarWebhookSumUp(req.body);
    res.sendStatus(200);
  } catch (erro) {
    console.log('Erro webhook:', erro.message);
    res.sendStatus(500);
  }
});

router.get('/webhook', (req, res) => {
  res.send('✅ Webhook SumUp ativo — confirmação automática funcionando');
});

module.exports = router;
