const db = require('../config/db');
async function getTaxa() {
  const r = await db.query('SELECT taxa_percentual FROM configuracao_plataforma LIMIT 1');
  return r.rows[0].taxa_percentual;
}
async function calcular(valorPago) {
  const taxa = await getTaxa();
  const valTaxa = Number(((valorPago * taxa)/100).toFixed(2));
  return { valorPago, taxaPercentual: taxa, taxaPlataforma: valTaxa, valorRepassado: Number((valorPago - valTaxa).toFixed(2)) };
}
async function setTaxa(nova) {
  await db.query('UPDATE configuracao_plataforma SET taxa_percentual=$1', [nova]);
  return nova;
}
module.exports = { calcular, getTaxa, setTaxa };
