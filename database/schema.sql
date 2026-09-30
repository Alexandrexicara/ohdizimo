-- Criar banco (separado, sem IF NOT EXISTS)
SELECT 1 FROM pg_database WHERE datname = 'ohdismo' \g
\if :?row_count = 0
    CREATE DATABASE ohdismo;
\endif

-- Conectar no banco criado
\c ohdismo;

CREATE TABLE IF NOT EXISTS configuracao_plataforma (
    id SERIAL PRIMARY KEY,
    taxa_percentual NUMERIC(5,2) NOT NULL DEFAULT 5.00,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS igrejas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    endereco TEXT,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    valor_dizimo_fixo NUMERIC(10,2),
    data_vencimento_dia INT NOT NULL,
    link_unico VARCHAR(150) UNIQUE NOT NULL,
    qrcode_url TEXT,
    dados_bancarios TEXT,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fieis (
    id SERIAL PRIMARY KEY,
    igreja_id INT REFERENCES igrejas(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    senha_hash TEXT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pagamentos (
    id SERIAL PRIMARY KEY,
    igreja_id INT REFERENCES igrejas(id) ON DELETE CASCADE,
    fiel_id INT REFERENCES fieis(id) ON DELETE CASCADE,
    valor_pago NUMERIC(10,2) NOT NULL,
    taxa_plataforma NUMERIC(10,2) NOT NULL,
    valor_repassado_igreja NUMERIC(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pendente',
    forma_pagamento VARCHAR(30),
    comprovante_codigo VARCHAR(100) UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir taxa padrão se não existir
INSERT INTO configuracao_plataforma (taxa_percentual)
SELECT 5.00 WHERE NOT EXISTS (SELECT 1 FROM configuracao_plataforma);
