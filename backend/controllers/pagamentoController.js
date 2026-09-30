const db = require('../config/db');
const { criarCobrancaContaIgreja } = require('../config/sumup');

const TAXA_PLATAFORMA = 5.00;

async function criarPagamento(dados) {
  const { fiel_id, igreja_id, valor_dizimo } = dados;
  const valorTotal = Number(valor_dizimo);

  const igreja = await db.query('SELECT * FROM igrejas WHERE id=$1', [igreja_id]);
  if (!igreja.rows.length) throw new Error('Igreja não encontrada');

  const ig = igreja.rows[0];
  const valorTaxa = Number((valorTotal * TAXA_PLATAFORMA / 100).toFixed(2));
  const valorIgreja = Number((valorTotal - valorTaxa).toFixed(2));

  const res = await db.query(`
    INSERT INTO pagamentos(
      igreja_id, fiel_id, valor_pago, valor_taxa_plataforma, valor_igreja_final,
      status, taxa_confirmada
    ) VALUES ($1, $2, $3, $4, $5, 'aguardando_pagamento', false)
    RETURNING *
  `, [igreja_id, fiel_id, valorTotal, valorTaxa, valorIgreja]);

  const pagamento = res.rows[0];
  const referencia = `dizimo_${pagamento.id}`;

  let linkPagamento = null;
  if (ig.sumup_api_key && ig.sumup_merchant_id) {
    const cob = await criarCobrancaContaIgreja(ig, valorTotal, referencia, `Dízimo - ${ig.nome}`);
    if (cob.sucesso) linkPagamento = cob.link;
  }

  return {
    sucesso: true,
    pagamento: {
      id: pagamento.id,
      valor_total: valorTotal,
      valor_taxa_plataforma: valorTaxa,
      valor_igreja: valorIgreja,
      link_pagamento: linkPagamento,
      chave_pix_igreja: ig.chave_pix,
      mensagem: linkPagamento
        ? 'Pague pelo link → confirmação automática ✅'
        : 'Pague no PIX da igreja'
    }
  };
}

async function processarWebhookSumUp(dados) {
  const { checkout_reference, status } = dados;
  if (!checkout_reference?.startsWith('dizimo_')) return;
  if (status !== 'PAID' && status !== 'successful') return;

  const pagamentoId = checkout_reference.replace('dizimo_', '');
  const res = await db.query(`
    UPDATE pagamentos
    SET status='concluido', taxa_confirmada=true, data_pagamento=NOW()
    WHERE id=$1 AND status='aguardando_pagamento'
    RETURNING id, valor_taxa_plataforma, valor_igreja_final
  `, [pagamentoId]);

  if (res.rows.length > 0) {
    console.log(`✅ CONFIRMADO #${pagamentoId} — Taxa: R$${res.rows[0].valor_taxa_plataforma} | Igreja: R$${res.rows[0].valor_igreja_final}`);
  }
}

module.exports = { criarPagamento, processarWebhookSumUp };
