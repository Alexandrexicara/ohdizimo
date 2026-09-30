const axios = require('axios');

const SUMUP_API_URL = 'https://api.sumup.com/v0.1';

async function criarCobrancaContaIgreja(igreja, valor, referencia, descricao) {
  try {
    const resposta = await axios.post(
      `${SUMUP_API_URL}/checkouts`,
      {
        amount: Number(valor),
        currency: 'BRL',
        checkout_reference: referencia,
        merchant_code: igreja.sumup_merchant_id,
        description: descricao,
        redirect_url: process.env.BASE_URL + '/pagamento/confirmado'
      },
      {
        headers: {
          'Authorization': `Bearer ${igreja.sumup_api_key}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return { sucesso: true, link: resposta.data.hosted_checkout_url };
  } catch (erro) {
    return { sucesso: false, erro: erro.response?.data || erro.message };
  }
}

module.exports = { criarCobrancaContaIgreja };
