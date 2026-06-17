const request = require('supertest');
const app = require('../index');
const pool = require('../config/db');

afterAll(async () => {
    await pool.end();
});

describe('GET /api/ci', () => {

    it('deve retornar o conteúdo de Comprehensible Input', async () => {
        const res = await request(app)
            .get('/api/ci');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('titulo');
        expect(res.body).toHaveProperty('descricao');
        expect(res.body).toHaveProperty('formula');
        expect(res.body).toHaveProperty('principios');
        expect(res.body).toHaveProperty('links');
    });

    it('deve retornar principios como array não vazio', async () => {
        const res = await request(app)
            .get('/api/ci');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.principios)).toBe(true);
        expect(res.body.principios.length).toBeGreaterThan(0);
    });

    it('deve retornar links como array não vazio', async () => {
        const res = await request(app)
            .get('/api/ci');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.links)).toBe(true);
        expect(res.body.links.length).toBeGreaterThan(0);
        expect(res.body.links[0]).toHaveProperty('nome');
        expect(res.body.links[0]).toHaveProperty('url');
    });

});