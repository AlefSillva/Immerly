<div align="center">

<h1>🌐 Immerly</h1>
<h3><em>Track your immersion. Own your progress.</em></h3>

<p>Uma aplicação web fullstack para estudantes autodidatas de inglês acompanharem sua exposição ao idioma com base no método de <strong>Comprehensible Input</strong> - de Stephen Krashen.</p>

<br/>

[![Deploy Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://immerly-eta.vercel.app)
[![Deploy Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://immerly-backend.onrender.com)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Tests](https://img.shields.io/badge/Testes-Jest%20%2B%20Supertest-C21325?style=for-the-badge&logo=jest)](https://jestjs.io)
[![License](https://img.shields.io/badge/Licença-MIT-blue?style=for-the-badge)](./LICENSE)

<br/>

### Dashboard
<p>
  <img src="./assets/dashboard-preview-1.png" width="49%"/>
  <img src="./assets/dashboard-preview-2.png" width="49%"/>
</p>

### Estatísticas
<p>
  <img src="./assets/estatisticas-preview-1.png" width="49%"/>
  <img src="./assets/estatisticas-preview-2.png" width="49%"/>
</p>

### Sessões
<p>
  <img src="./assets/sessoes-preview-1.png" width="49%"/>
  <img src="./assets/sessoes-preview-2.png" width="49%"/>
</p>

---

> 🎓 Projeto Supervisionado - Análise e Desenvolvimento de Sistemas · 2026

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Teoria por trás](#-a-teoria-por-trás-comprehensible-input)
- [Funcionalidades](#-funcionalidades)
- [Stack & Arquitetura](#-stack--arquitetura)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Testes Automatizados](#-testes-automatizados)
- [Deploy](#-deploy)
- [API - Endpoints](#-api--endpoints)
- [Status do Projeto](#-status-do-projeto)

---

## 💡 Sobre o Projeto

O **Immerly** nasceu de uma necessidade real: organizar e mensurar o aprendizado autodidata de inglês de forma séria e consistente.

Não é uma plataforma de ensino. Não tem exercícios, flashcards ou gamificação artificial. É um **sistema de acompanhamento da imersão** — feito para quem já sabe que a exposição constante ao idioma é o caminho, e quer dados reais sobre sua evolução.

A proposta é simples: registre cada sessão de exposição (podcast, série, leitura, conversa), visualize seu progresso acumulado e mantenha a consistência com metas e streaks.

---

## 📖 A Teoria por Trás: Comprehensible Input

O método de **Comprehensible Input**, desenvolvido pelo linguista **Stephen Krashen**, defende que a aquisição de uma língua ocorre naturalmente quando o aprendiz é exposto a conteúdo que ele consegue compreender, mesmo que parcialmente. A produção fluente é consequência da imersão, não do estudo mecânico de gramática.

O Immerly foi construído inteiramente em torno desse princípio: registre sua exposição, mantenha a consistência, deixe a aquisição acontecer.

---

## ✨ Funcionalidades

### 📝 Sessões de Imersão
- Registro de sessões com tipo (série, podcast, leitura, etc.), duração, data e nível estimado
- Edição e exclusão de sessões já registradas
- Filtro por tipo de conteúdo e por intervalo de datas
- Paginação server-side para grandes volumes de dados

### 📊 Dashboard & Métricas
- Total de horas acumuladas de imersão
- Média diária de minutos
- Streak de dias ativos consecutivos
- Distribuição de sessões por tipo (gráfico)
- Histórico de progresso ao longo do tempo

### 🎯 Metas Personalizadas
- Definição de meta semanal de minutos de imersão
- Acompanhamento do progresso em relação à meta
- Feedback visual de metas atingidas

### 📚 Biblioteca de Recursos
- Recursos gratuitos curados para imersão em inglês
- Filtro por tipo e nível (iniciante, intermediário, avançado)
- Administração de recursos via painel admin
- Paginação e carrossel responsivo

### 🔐 Autenticação & Perfil
- Registro e login com JWT
- Gerenciamento de perfil do usuário
- Rotas protegidas por middleware de autenticação

---

## 🛠️ Stack & Arquitetura

### Frontend
| Tecnologia | Uso |
|---|---|
| React 18 | Framework de UI |
| Vite | Bundler e dev server |
| CSS Modules | Estilização com escopo por componente |
| React Router v6 | Roteamento client-side |
| Recharts | Gráficos do dashboard |
| Axios | Requisições HTTP |

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js | Runtime |
| Express | Framework HTTP |
| PostgreSQL | Banco de dados relacional |
| JWT | Autenticação stateless |
| bcrypt | Hash de senhas |
| dotenv | Gerenciamento de variáveis de ambiente |

### Testes
| Tecnologia | Uso |
|---|---|
| Jest | Runner e assertions |
| Supertest | Testes de integração HTTP |

### Infraestrutura
| Serviço | Uso |
|---|---|
| Vercel | Deploy do frontend (CD automático via GitHub) |
| Render | Deploy do backend (free tier) |
| Supabase | PostgreSQL gerenciado em produção |
| GitHub Actions | CI — roda testes a cada push |

---

## 📁 Estrutura de Pastas

```
Immerly/
├── backend/
│   ├── config/
│   │   └── db.js               # Conexão com o banco (resolve por NODE_ENV)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── sessoesController.js
│   │   ├── metasController.js
│   │   ├── metricasController.js
│   │   ├── recursosController.js
│   │   └── perfilController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── validators/         # Validação e erros padronizados { message, code }
│   ├── routes/
│   ├── tests/                  # 7 suítes Jest + Supertest
│   ├── .env
│   ├── .env.test
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/              # useEstatisticas, useRecursos, useMetas, useSessoes
│   │   ├── pages/
│   │   ├── services/           # Camada de API (axios)
│   │   └── main.jsx
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL instalado e rodando localmente
- npm ou yarn

### 1. Clone o repositório

```bash
git clone https://github.com/AlefSillva/Immerly.git
cd Immerly
```

### 2. Configure o banco de dados

Crie dois bancos no PostgreSQL local:

```sql
CREATE DATABASE immerly;
CREATE DATABASE immerly_test;
```

Execute as migrations (se houver) ou deixe o `db.js` criar as tabelas na primeira execução.

### 3. Configure as variáveis de ambiente

```bash
# backend/.env
cp backend/.env.example backend/.env
# Edite com suas credenciais locais

# backend/.env.test
cp backend/.env.example backend/.env.test
# Configure apontando para o banco immerly_test
```

### 4. Instale as dependências e suba o backend

```bash
cd backend
npm install
npm run dev
```

### 5. Instale as dependências e suba o frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173` e o backend em `http://localhost:3000`.

---

## 🔑 Variáveis de Ambiente

### `backend/.env`

```env
# Banco local
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=immerly

# JWT
JWT_SECRET=sua_chave_secreta

# Ambiente
NODE_ENV=development
PORT=3000
```

### `backend/.env.test`

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=immerly_test

JWT_SECRET=test_secret
NODE_ENV=test
```

> ⚠️ Em produção, a variável `DATABASE_URL` do Supabase deve ter os caracteres especiais da senha URL-encoded (ex: `;` → `%3B`, `?` → `%3F`).

---

## 🧪 Testes Automatizados

O projeto conta com **7 suítes de testes** cobrindo todas as rotas principais da API:

```
tests/
├── auth.test.js        # Registro, login, tokens
├── sessoes.test.js     # CRUD completo de sessões
├── perfil.test.js      # Leitura e atualização de perfil
├── metas.test.js       # Definição e consulta de metas
├── metricas.test.js    # Cálculo de métricas e streak
├── recursos.test.js    # CRUD de recursos (admin)
└── ci.test.js          # Smoke test para o pipeline de CI
```

### Rodando os testes

```bash
cd backend
npm test
```

Os testes rodam contra o banco `immerly_test` (isolado do desenvolvimento) e são executados automaticamente via **GitHub Actions** a cada push na branch `main`.

---

## ☁️ Deploy

### Frontend - Vercel
O deploy é feito automaticamente via integração com o GitHub. Cada push na branch `main` aciona um novo build.

🔗 **https://immerly-eta.vercel.app**

### Backend - Render
Hospedado no plano free do Render. O serviço entra em modo sleep após inatividade e pode demorar alguns segundos na primeira requisição.

🔗 **https://immerly-backend.onrender.com**

### Banco de Dados - Supabase
PostgreSQL gerenciado conectado via **Session Pooler (IPv4)** para compatibilidade com o plano free do Render.

---

## 📡 API - Endpoints

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/register` | Cria novo usuário |
| `POST` | `/api/auth/login` | Autentica e retorna JWT |

### Sessões `🔒`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/sessoes` | Lista sessões com filtros e paginação |
| `POST` | `/api/sessoes` | Cria nova sessão |
| `PUT` | `/api/sessoes/:id` | Atualiza sessão existente |
| `DELETE` | `/api/sessoes/:id` | Remove sessão |

### Métricas `🔒`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/metricas` | Retorna estatísticas acumuladas e streak |

### Metas `🔒`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/metas` | Consulta meta semanal do usuário |
| `POST` | `/api/metas` | Define ou atualiza meta semanal |

### Recursos
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/recursos` | Lista recursos com filtros e paginação |
| `POST` | `/api/recursos` | Cria recurso (admin) |
| `PUT` | `/api/recursos/:id` | Atualiza recurso (admin) |
| `DELETE` | `/api/recursos/:id` | Remove recurso (admin) |

### Perfil `🔒`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/perfil` | Retorna dados do usuário autenticado |
| `PUT` | `/api/perfil` | Atualiza dados do perfil |

> 🔒 Rotas protegidas exigem header `Authorization: Bearer <token>`

Todos os erros seguem o padrão:
```json
{
  "message": "Descrição legível do erro",
  "code": "CODIGO_DO_ERRO"
}
```

---

## 📌 Status do Projeto

| Módulo | Status |
|---|---|
| Autenticação (registro/login) | ✅ Concluído |
| CRUD de sessões | ✅ Concluído |
| Filtros por tipo e data (server-side) | ✅ Concluído |
| Paginação server-side | ✅ Concluído |
| Dashboard com métricas e gráficos | ✅ Concluído |
| Streak e metas personalizadas | ✅ Concluído |
| Biblioteca de recursos com filtros | ✅ Concluído |
| Testes automatizados (7 suítes) | ✅ Concluído |
| CI via GitHub Actions | ✅ Concluído |
| Deploy frontend (Vercel) | ✅ Concluído |
| Deploy backend (Render) | ✅ Concluído |
| Banco em produção (Supabase) | ✅ Concluído |

---

## 👨‍💻 Autor

**Alef Silva**

Desenvolvido como Projeto Supervisionado do curso de **Análise e Desenvolvimento de Sistemas** - 2026.

[![GitHub](https://img.shields.io/badge/GitHub-AlefSillva-181717?style=flat-square&logo=github)](https://github.com/AlefSillva)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Alef%20Silva-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/alefsilvasantos15/)
---

<div align="center">
  <sub>Imersão não é método. É estilo de vida.</sub>
</div>
