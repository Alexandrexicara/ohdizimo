const express = require('express');
const router = express.Router();

// Valor PADRÃO — sempre vai ter número, nunca undefined
let taxaConfig = { percentual: 5.00 };

router.get('/taxa', (req, res) => {
  res.json({ percentual: taxaConfig.percentual });
});

router.put('/taxa', (req, res) => {
  // Garante que só salva número válido
  let novoValor = Number(req.body.percentual);
  if (isNaN(novoValor) || novoValor < 0 || novoValor > 100) {
    novoValor = 5.00; // volta pro padrão se der erro
  }
  taxaConfig.percentual = novoValor;
  res.json({ 
    sucesso: true, 
    percentual: taxaConfig.percentual,
    mensagem: `Taxa alterada para ${taxaConfig.percentual}%`
  });
});

module.exports = router;
