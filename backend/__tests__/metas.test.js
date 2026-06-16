const request = require('supertest');
const app = require('../index');
const pool = require('../config/db');

let token;

beforeEach(async () => {
    await pool.query('DELETE FROM sessoes');
    await pool.query('DELETE FROM metas');
    await pool.query('DELETE FROM usuarios');

    const res = await request(app)
        .post('/api/auth/register')
        .send({
            nome: 'Usuário Teste',
            email: 'teste@email.com',
            senha: 'senha123'
        });

    token = res.body.token;
});

afterAll(async () => {
    await pool.end();
});

describe('POST /api/metas', () => {

    it('deve criar uma meta com sucesso', async () => {
        const res = await request(app)
            .post('/api/metas')
            .set('Authorization', `Bearer ${token}`)
            .send({ meta_semanal: 5, meta_mensal: 20 });

        expect(res.statusCode).toBe(201);
        expect(res.body.meta).toHaveProperty('id');
    });

    it('deve rejeitar criação de meta duplicada', async () => {
        await request(app)
            .post('/api/metas')
            .set('Authorization', `Bearer ${token}`)
            .send({ meta_semanal: 5, meta_mensal: 20 });

        const res = await request(app)
            .post('/api/metas')
            .set('Authorization', `Bearer ${token}`)
            .send({ meta_semanal: 10, meta_mensal: 40 });

        expect(res.statusCode).toBe(409);
    });

    it('deve rejeitar criação sem meta_semanal', async () => {
        const res = await request(app)
            .post('/api/metas')
            .set('Authorization', `Bearer ${token}`)
            .send({ meta_mensal: 20 });

        expect(res.statusCode).toBe(400);
    });

    it('deve rejeitar criação sem meta_mensal', async () => {
        const res = await request(app)
            .post('/api/metas')
            .set('Authorization', `Bearer ${token}`)
            .send({ meta_semanal: 5 });

        expect(res.statusCode).toBe(400);
    });

    it('deve rejeitar criação sem token', async () => {
        const res = await request(app)
            .post('/api/metas')
            .send({ meta_semanal: 5, meta_mensal: 20 });

        expect(res.statusCode).toBe(401);
    });

});

describe('PUT /api/metas', () => {

    beforeEach(async () => {
        await request(app)
            .post('/api/metas')
            .set('Authorization', `Bearer ${token}`)
            .send({ meta_semanal: 5, meta_mensal: 20 });
    });

    it('deve atualizar uma meta com sucesso', async () => {
        const res = await request(app)
            .put('/api/metas')
            .set('Authorization', `Bearer ${token}`)
            .send({ meta_semanal: 10, meta_mensal: 40 });

        expect(res.statusCode).toBe(200);
        expect(res.body.meta.meta_semanal).toBe('10.0');
    });

    it('deve rejeitar atualização sem meta_semanal', async () => {
        const res = await request(app)
            .put('/api/metas')
            .set('Authorization', `Bearer ${token}`)
            .send({ meta_mensal: 40 });

        expect(res.statusCode).toBe(400);
    });

    it('deve rejeitar atualização sem token', async () => {
        const res = await request(app)
            .put('/api/metas')
            .send({ meta_semanal: 10, meta_mensal: 40 });

        expect(res.statusCode).toBe(401);
    });

    it('deve rejeitar atualização sem meta cadastrada', async () => {
        // Deleta as metas do usuário direto no banco
        await pool.query('DELETE FROM metas');

        const res = await request(app)
            .put('/api/metas')
            .set('Authorization', `Bearer ${token}`)
            .send({ meta_semanal: 10, meta_mensal: 40 });

        expect(res.statusCode).toBe(404);
    });

});

describe('GET /api/metas', () => {

    it('deve buscar a meta com sucesso', async () => {
        await request(app)
            .post('/api/metas')
            .set('Authorization', `Bearer ${token}`)
            .send({ meta_semanal: 5, meta_mensal: 20 });

        const res = await request(app)
            .get('/api/metas')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.meta).toHaveProperty('meta_semanal');
        expect(res.body.meta).toHaveProperty('meta_mensal');
    });

    it('deve retornar 404 quando não há meta cadastrada', async () => {
        const res = await request(app)
            .get('/api/metas')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
    });

    it('deve rejeitar busca sem token', async () => {
        const res = await request(app)
            .get('/api/metas');

        expect(res.statusCode).toBe(401);
    });

});