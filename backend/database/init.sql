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
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('filme', 'serie', 'podcast', 'video', 'livro', 'musica', 'artigo')),
    duracao_minutos INTEGER NOT NULL,
    nivel_estimado VARCHAR(2) NOT NULL CHECK (nivel_estimado IN ('A1', 'A2', 'B1', 'B2', 'C1')),
    grau_compreensao INTEGER NOT NULL CHECK (grau_compreensao BETWEEN 1 AND 5),
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
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ( 'listening', 'speaking', 'reading', 'writing', 'grammar', 'vocabulary', 'reference' )),
    nivel VARCHAR(2) CHECK (nivel IN ('A1', 'A2', 'B1', 'B2', 'C1')),
    descricao TEXT,
    link_externo VARCHAR(500) NOT NULL
);