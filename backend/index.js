// Importa o framework Express para criar o servidor
const express = require('express');

// Importa o dotenv para carregar as variáveis do arquivo .env
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do .env
dotenv.config();

// Cria a instância do servidor Express
const app = express();

// Importa o middleware CORS para permitir requisições do frontend
const cors = require('cors');

// Configura o CORS para aceitar requisições do frontend (ajuste a origem conforme necessário)
app.use(cors());

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

// Registra as rotas de métricas com o prefixo /api/metricas
app.use('/api/metricas', metricasRoutes);
//-----------------------------------------------

// Importa as rotas de metas
const metasRoutes = require('./routes/metas');

// Registra as rotas de metas com o prefixo /api/metas
app.use('/api/metas', metasRoutes);
//-----------------------------------------------

// Importa as rotas de recursos
const recursosRoutes = require('./routes/recursos');

// Registra as rotas de recursos com o prefixo /api/recursos
app.use('/api/recursos', recursosRoutes);
//-----------------------------------------------

// Importa as rotas de Comprehensible Input
const ciRoutes = require('./routes/ci');

// Registra as rotas de CI com o prefixo /api/ci
app.use('/api/ci', ciRoutes);
//-----------------------------------------------

// Importa as rotas de administração
const adminRoutes = require('./routes/admin');

// Registra as rotas de admin com o prefixo /api/admin
app.use('/api/admin', adminRoutes);
//-----------------------------------------------

// Importa as rotas de perfil
const perfilRoutes = require('./routes/perfil');

// Registra as rotas de perfil com o prefixo /api/perfil
app.use('/api/perfil', perfilRoutes);
//-----------------------------------------------

const errorHandler = require('./middlewares/errorMiddleware');

// Deve ser o último middleware registrado
app.use(errorHandler);
//-----------------------------------------------


//*************************************************************

// Rota raiz para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.json({ message: 'Immerly API is running' });
});


//*************************************************************

module.exports = app;