# É OHDIZIMO

Plataforma de dízimos e doações construída com Node.js, Express e PostgreSQL.

## Servidor MCP

Servidor Model Context Protocol remoto usando Streamable HTTP.

- Endpoint: `https://ohdizimo.onrender.com/mcp`
- Saúde: `https://ohdizimo.onrender.com/mcp/health`
- Transporte: Streamable HTTP stateless
- Autenticação: Bearer token obrigatório nas chamadas MCP.

### Ferramentas

| Ferramenta | Função |
| --- | --- |
| `pesquisar_igrejas` | Pesquisa pelo nome e retorna somente ID, nome e situação |
| `consultar_indicadores` | Contagens agregadas de igrejas, fiéis e registros de contribuição |
| `verificar_sistema` | Verifica conexão com PostgreSQL |

Por segurança, o MCP não permite criar, alterar, confirmar, cancelar ou movimentar pagamentos. Também não expõe CPF/CNPJ, telefones, e-mails, credenciais, referências ou valores individuais.

### Configuração obrigatória no Render

No serviço Render, abra **Environment** e adicione:

- Key: `MCP_API_TOKEN`
- Value: segredo aleatório exclusivo com pelo menos 32 caracteres.

Não coloque o token no GitHub, README, código-fonte ou mensagens. Salve a variável e faça deploy/restart do serviço.

### Conectar um cliente MCP

- URL: `https://ohdizimo.onrender.com/mcp`
- Transporte: Streamable HTTP
- Cabeçalho: `Authorization: Bearer SEU_TOKEN`

O cliente deve aceitar cabeçalhos HTTP personalizados. O endereço sozinho não concede acesso.

### Desenvolvimento local

1. Execute `npm install`.
2. Configure `DATABASE_URL` e `MCP_API_TOKEN` no `.env`.
3. Inicie com `npm start`.

O MCP é montado no backend principal `backend/server.js` e não substitui as rotas atuais.

## Segurança

Credenciais de pagamento publicadas no histórico Git devem ser revogadas no provedor e substituídas por variáveis secretas no Render. Nunca versione chaves, tokens, senhas ou URLs privadas de banco de dados.
