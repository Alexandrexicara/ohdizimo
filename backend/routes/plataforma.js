const express = require('express');
const router = express.Router();

let taxaConfig = { percentual: 5.00 };

router.get('/taxa', (req, res) => res.json(taxaConfig));

router.put('/taxa', (req, res) => {
  if (req.body.percentual !== undefined) {
    taxaConfig.percentual = Number(req.body.percentual);
  }
  res.json({ sucesso: true, taxa: taxaConfig });
});

module.exports = router;
