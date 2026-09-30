// ==============================================
// É OHDISMO — JS COMPLETO
// ==============================================

const API = '/api';

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

function mostrarSucesso(texto) {
  return `<div class="cx-sucesso">${texto}</div>`;
}

function mostrarErro(texto) {
  return `<div class="cx-erro">${texto}</div>`;
}

async function buscarTaxa() {
  try {
    const res = await fetch(`${API}/plataforma/taxa`);
    const dados = await res.json();
    const el = document.getElementById('taxaGlobal');
    if (el) el.textContent = dados.taxa_atual + '%';
  } catch (e) {
    console.log('Aguardando banco...');
  }
}

window.OHD = {
  formatarMoeda,
  formatarData,
  mostrarSucesso,
  mostrarErro,
  API
};

document.addEventListener('DOMContentLoaded', buscarTaxa);
