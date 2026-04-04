CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessoes (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id),
    nome_conteudo VARCHAR(200) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    duracao_minutos INTEGER NOT NULL,
    nivel_estimado VARCHAR(5) NOT NULL,
    grau_compreensao INTEGER NOT NULL,
    data DATE DEFAULT CURRENT_DATE
);

CREATE TABLE  metas (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id),
    meta_semanal DECIMAL(5,1),
    meta_mensal DECIMAL(5,1),
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recursos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    nivel VARCHAR(5) NOT NULL,
    descricao TEXT,
    link_externo VARCHAR(500) NOT NULL
);