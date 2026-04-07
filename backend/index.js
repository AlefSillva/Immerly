// Importa o framework Express para criar o servidor
const express = require('express');

// Importa o dotenv para carregar as variáveis do arquivo .env
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do .env
dotenv.config();

// Cria a instância do servidor Express
const app = express();

// Permite que o servidor entenda requisições com corpo em JSON
app.use(express.json());

// Importa a conexão com o banco de dados PostgreSQL
const pool = require('./config/db');

// Testa a conexão com o banco de dados ao iniciar o servidor
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected at:', res.rows[0].now);
    }
});
//-----------------------------------------------

// Importa as rotas de autenticação (registro e login)
const authRoutes = require('./routes/auth');

// Registra as rotas de autenticação com o prefixo /api/auth
// Ex: POST /api/auth/register | POST /api/auth/login
app.use('/api/auth', authRoutes);
//-----------------------------------------------

// Importa as rotas de sessões
const sessoesRoutes = require('./routes/sessoes');

// Registra as rotas de sessões com o prefixo /api/sessoes
// Ex: POST /api/sessoes | GET /api/sessoes
app.use('/api/sessoes', sessoesRoutes);
//-----------------------------------------------

// Importa as rotas de métricas
const metricasRoutes = require('./routes/metricas');

app.use('/api/metricas', metricasRoutes);
//-----------------------------------------------

// Importa as rotas de metas
const metasRoutes = require('./routes/metas');

app.use('/api/metas', metasRoutes);
//-----------------------------------------------


//*************************************************************
// Rota raiz para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.json({ message: 'Immerly API is running' });
});

// Define a porta do servidor — usa a do .env ou 3000 como padrão
const PORT = process.env.PORT || 3000;

// Inicia o servidor e exibe a porta no terminal
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

