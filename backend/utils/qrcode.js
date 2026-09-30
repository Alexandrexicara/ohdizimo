const QRCode = require('qrcode');
require('dotenv').config();
function gerarLink(nome) {
  return nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
}
async function gerarQR(link) {
  return await QRCode.toDataURL(`${process.env.BASE_URL}/fiel/cadastro/${link}`, {width:300});
}
module.exports = { gerarLink, gerarQR };
