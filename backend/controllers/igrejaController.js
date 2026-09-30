const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { gerarLink, gerarQR } = require('../utils/qrcode');

async function cadastrar(dados) {
  const hash = await bcrypt.hash(dados.senha, 10);
  const link = gerarLink(dados.nome);
  const qr = await gerarQR(link);
  const res = await db.query(
    `INSERT INTO igrejas(nome,cnpj,endereco,telefone,email,senha_hash,valor_dizimo_fixo,data_vencimento_dia,link_unico,qrcode_url,dados_bancarios)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [dados.nome, dados.cnpj, dados.endereco, dados.telefone, dados.email, hash, dados.valor_dizimo_fixo, dados.data_vencimento_dia, link, qr, dados.dados_bancarios]
  );
  return res.rows[0];
}

async function buscarPorLink(link) {
  const res = await db.query('SELECT * FROM igrejas WHERE link_unico=$1 AND ativo=true', [link]);
  return res.rows[0];
}

async function listarTodas() {
  const res = await db.query('SELECT id, nome, cnpj, telefone, valor_dizimo_fixo, data_vencimento_dia, link_unico, criado_em FROM igrejas WHERE ativo=true ORDER BY nome');
  return res.rows;
}

module.exports = { cadastrar, buscarPorLink, listarTodas };
