CREATE TABLE IF NOT EXISTS pagamentos_taxa (
  id SERIAL PRIMARY KEY,
  referencia VARCHAR(100) UNIQUE NOT NULL,
  fiel_nome VARCHAR(200),
  fiel_telefone VARCHAR(30),
  igreja_id INTEGER,
  valor_taxa_plataforma DECIMAL(10,2) NOT NULL,
  taxa_paga BOOLEAN DEFAULT false,
  data_pagamento_taxa TIMESTAMP,
  valor_dizimo DECIMAL(10,2),
  chave_pix_igreja TEXT,
  dizimo_pago BOOLEAN DEFAULT false,
  data_pagamento_dizimo TIMESTAMP,
  status VARCHAR(30) DEFAULT 'aguardando_taxa',
  criado_em TIMESTAMP DEFAULT NOW()
);
