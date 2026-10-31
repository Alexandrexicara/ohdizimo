const express = require('express');
const crypto = require('crypto');
const { z } = require('zod');
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const db = require('../config/db');
const router = express.Router();
function autenticarMcp(req, res, next) {
  const esperado = process.env.MCP_API_TOKEN || '';
  if (esperado.length < 32) return res.status(503).json({ erro: 'MCP não configurado: defina MCP_API_TOKEN no Render.' });
  const header = req.get('authorization') || '';
  const recebido = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const a = Buffer.from(esperado); const b = Buffer.from(recebido);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ erro: 'Token MCP inválido ou ausente.' });
  next();
}
function criarServidorMcp() {
  const server = new McpServer({ name: 'ohdizimo-mcp', version: '1.0.0' });
  server.registerTool('pesquisar_igrejas', { title: 'Pesquisar igrejas', description: 'Pesquisa igrejas pelo nome. Retorna somente ID, nome e situação; nunca expõe CPF/CNPJ, telefone, e-mail, endereço ou credenciais.', inputSchema: { termo: z.string().trim().max(80).optional().describe('Parte do nome da igreja; opcional.') } }, async ({ termo }) => {
    try { const busca = termo ? '%' + termo + '%' : null;
      const r = await db.query("SELECT id, nome, ativo FROM igrejas WHERE ($1::text IS NULL OR nome ILIKE $1) ORDER BY nome LIMIT 30", [busca]);
      return { content: [{ type: 'text', text: JSON.stringify({ total_retornado: r.rows.length, limite: 30, igrejas: r.rows }, null, 2) }] };
    } catch (e) { console.error('[MCP] pesquisar_igrejas:', e.message); return { content: [{ type: 'text', text: 'Falha ao pesquisar igrejas no banco.' }], isError: true }; }
  });
  server.registerTool('consultar_indicadores', { title: 'Consultar indicadores gerais', description: 'Retorna contagens agregadas de igrejas, fiéis e registros de contribuição. Não retorna nomes, telefones, valores individuais ou dados de pagamento.', inputSchema: {} }, async () => {
    try { const [i,f,p] = await Promise.all([db.query('SELECT COUNT(*)::int AS total FROM igrejas'),db.query('SELECT COUNT(*)::int AS total FROM fieis'),db.query('SELECT COUNT(*)::int AS total FROM pagamentos_taxa')]);
      return { content: [{ type: 'text', text: JSON.stringify({ igrejas_cadastradas:i.rows[0].total, fieis_cadastrados:f.rows[0].total, registros_de_contribuicao:p.rows[0].total, natureza:'Somente dados agregados.' }, null, 2) }] };
    } catch (e) { console.error('[MCP] consultar_indicadores:',e.message); return { content:[{type:'text',text:'Falha ao consultar indicadores; confira a conexão e as tabelas do banco.'}],isError:true }; }
  });
  server.registerTool('verificar_sistema',{title:'Verificar sistema',description:'Verifica a conexão do serviço com o PostgreSQL.',inputSchema:{}},async()=>{
    try { await db.query('SELECT 1'); return {content:[{type:'text',text:JSON.stringify({sistema:'É OHDIZIMO',mcp:'online',banco_de_dados:'conectado',versao_mcp:'1.0.0'},null,2)}]}; }
    catch(e){console.error('[MCP] verificar_sistema:',e.message);return {content:[{type:'text',text:'MCP ativo, mas o banco de dados não respondeu.'}],isError:true};}
  }); return server;
}
router.get('/health',(req,res)=>res.json({service:'ohdizimo-mcp',transport:'streamable-http',endpoint:'/mcp',authentication:'bearer-token-required'}));
router.post('/',autenticarMcp,async(req,res)=>{ const server=criarServidorMcp(); const transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined});
  try{await server.connect(transport);await transport.handleRequest(req,res,req.body);}
  catch(e){console.error('[MCP] request:',e.message);if(!res.headersSent)res.status(500).json({jsonrpc:'2.0',error:{code:-32603,message:'Erro interno no servidor MCP.'},id:null});}
  finally{try{await transport.close();}catch(_){}try{await server.close();}catch(_){}}
});
router.get('/',autenticarMcp,(req,res)=>res.status(405).json({erro:'Use POST para mensagens MCP Streamable HTTP.'}));
router.delete('/',autenticarMcp,(req,res)=>res.status(405).json({erro:'Este servidor MCP utiliza modo stateless.'}));
module.exports=router;
