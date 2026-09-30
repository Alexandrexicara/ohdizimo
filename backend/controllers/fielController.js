const db = require('../config/db');
const bcrypt = require('bcryptjs');
async function cadastrar(d) {
  const hash = await bcrypt.hash(d.senha,10);
  const r = await db.query(
    `INSERT INTO fieis(igreja_id,nome,cpf,telefone,email,senha_hash) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,nome,igreja_id`,
    [d.igreja_id,d.nome,d.cpf,d.telefone,d.email,hash]
  );
  return r.rows[0];
}
async function listarPorIgreja(id) {
  const r = await db.query('SELECT * FROM fieis WHERE igreja_id=$1 AND ativo=true',[id]);
  return r.rows;
}
module.exports = { cadastrar, listarPorIgreja };
