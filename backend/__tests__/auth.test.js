const request = require('supertest');
const app = require('../index');
const pool = require('../config/db');

// Limpa a tabela de usuários antes de cada teste
beforeEach(async () => {
    await pool.query('DELETE FROM sessoes');
    await pool.query('DELETE FROM metas');
    await pool.query('DELETE FROM usuarios');
});

// Fecha a conexão com o banco após todos os testes
afterAll(async () => {
    await pool.end();
});

describe('POST /api/auth/register', () => {

    it('deve registrar um novo usuário com sucesso', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                nome: 'Usuário Teste',
                email: 'teste@email.com',
                senha: 'senha123'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
    });

    it('deve rejeitar registro com email já existente', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                nome: 'Usuário Teste',
                email: 'teste@email.com',
                senha: 'senha123'
            });

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                nome: 'Outro Usuário',
                email: 'teste@email.com',
                senha: 'senha456'
            });

        expect(res.statusCode).toBe(409);
    });

    it('deve rejeitar registro sem nome', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'teste@email.com',
                senha: 'senha123'
            });

        expect(res.statusCode).toBe(400);
    });

    it('deve rejeitar registro sem email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                nome: 'Usuário Teste',
                senha: 'senha123'
            });

        expect(res.statusCode).toBe(400);
    });

    it('deve rejeitar registro sem senha', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                nome: 'Usuário Teste',
                email: 'teste@email.com'
            });

        expect(res.statusCode).toBe(400);
    });

});

describe('POST /api/auth/login', () => {

    beforeEach(async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                nome: 'Usuário Teste',
                email: 'teste@email.com',
                senha: 'senha123'
            });
    });

    it('deve fazer login com sucesso', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'teste@email.com',
                senha: 'senha123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('deve rejeitar login com senha errada', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'teste@email.com',
                senha: 'senhaerrada'
            });

        expect(res.statusCode).toBe(401);
    });

    it('deve rejeitar login com email inexistente', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'naoexiste@email.com',
                senha: 'senha123'
            });

        expect(res.statusCode).toBe(401);
    });

    it('deve rejeitar login sem email', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                senha: 'senha123'
            });

        expect(res.statusCode).toBe(400);
    });

    it('deve rejeitar login sem senha', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'teste@email.com'
            });

        expect(res.statusCode).toBe(400);
    });

});