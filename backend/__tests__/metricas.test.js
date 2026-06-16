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

describe('GET /api/metricas', () => {

    it('deve retornar métricas zeradas quando não há sessões', async () => {
        const res = await request(app)
            .get('/api/metricas')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.total_horas).toBe(0);
        expect(res.body.streak_dias).toBe(0);
        expect(res.body).toHaveProperty('mensagem_motivacional');
    });

    it('deve retornar métricas corretas com sessões cadastradas', async () => {
        await request(app)
            .post('/api/sessoes')
            .set('Authorization', `Bearer ${token}`)
            .send({ nome_conteudo: 'Friends', tipo: 'serie', duracao_minutos: 60, nivel_estimado: 'B1', grau_compreensao: 4 });

        const res = await request(app)
            .get('/api/metricas')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.total_horas).toBe(1);
        expect(res.body).toHaveProperty('media_semanal_horas');
        expect(res.body).toHaveProperty('media_mensal_horas');
        expect(res.body).toHaveProperty('projecao_4_semanas_horas');
    });

    it('deve rejeitar sem token', async () => {
        const res = await request(app)
            .get('/api/metricas');

        expect(res.statusCode).toBe(401);
    });

});

describe('GET /api/metricas/historico', () => {

    it('deve retornar histórico vazio quando não há sessões', async () => {
        const res = await request(app)
            .get('/api/metricas/historico')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.por_dia).toEqual([]);
        expect(res.body.por_tipo).toEqual([]);
    });

    it('deve retornar histórico com sessões cadastradas', async () => {
        await request(app)
            .post('/api/sessoes')
            .set('Authorization', `Bearer ${token}`)
            .send({ nome_conteudo: 'BBC News', tipo: 'video', duracao_minutos: 30, nivel_estimado: 'B2', grau_compreensao: 3 });

        const res = await request(app)
            .get('/api/metricas/historico')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.por_tipo.length).toBeGreaterThan(0);
    });

    it('deve rejeitar sem token', async () => {
        const res = await request(app)
            .get('/api/metricas/historico');

        expect(res.statusCode).toBe(401);
    });

});

describe('GET /api/metricas/evolucao-nivel', () => {

    it('deve retornar evolução vazia quando não há sessões', async () => {
        const res = await request(app)
            .get('/api/metricas/evolucao-nivel')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.evolucao).toEqual([]);
    });

    it('deve retornar evolução com nível correto', async () => {
        await request(app)
            .post('/api/sessoes')
            .set('Authorization', `Bearer ${token}`)
            .send({ nome_conteudo: 'Friends', tipo: 'serie', duracao_minutos: 60, nivel_estimado: 'A1', grau_compreensao: 3 });

        const res = await request(app)
            .get('/api/metricas/evolucao-nivel')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.evolucao[0]).toHaveProperty('nivel', 'A1');
        expect(res.body.evolucao[0]).toHaveProperty('horas_acumuladas');
    });

    it('deve rejeitar sem token', async () => {
        const res = await request(app)
            .get('/api/metricas/evolucao-nivel');

        expect(res.statusCode).toBe(401);
    });

});

describe('GET /api/metricas/horas-por-mes', () => {

    it('deve retornar array vazio quando não há sessões', async () => {
        const res = await request(app)
            .get('/api/metricas/horas-por-mes')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.por_mes).toEqual([]);
    });

    it('deve retornar horas agrupadas por mês', async () => {
        await request(app)
            .post('/api/sessoes')
            .set('Authorization', `Bearer ${token}`)
            .send({ nome_conteudo: 'Friends', tipo: 'serie', duracao_minutos: 120, nivel_estimado: 'B1', grau_compreensao: 4 });

        const res = await request(app)
            .get('/api/metricas/horas-por-mes')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.por_mes.length).toBeGreaterThan(0);
        expect(res.body.por_mes[0]).toHaveProperty('mes');
        expect(res.body.por_mes[0]).toHaveProperty('horas');
    });

    it('deve rejeitar sem token', async () => {
        const res = await request(app)
            .get('/api/metricas/horas-por-mes');

        expect(res.statusCode).toBe(401);
    });

});

describe('GET /api/metricas/horas-por-tipo-mes', () => {

    it('deve retornar array vazio quando não há sessões', async () => {
        const res = await request(app)
            .get('/api/metricas/horas-por-tipo-mes')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.por_tipo_mes).toEqual([]);
    });

    it('deve retornar horas agrupadas por tipo e mês', async () => {
        await request(app)
            .post('/api/sessoes')
            .set('Authorization', `Bearer ${token}`)
            .send({ nome_conteudo: 'Friends', tipo: 'serie', duracao_minutos: 60, nivel_estimado: 'B1', grau_compreensao: 4 });

        const res = await request(app)
            .get('/api/metricas/horas-por-tipo-mes')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.por_tipo_mes[0]).toHaveProperty('mes');
        expect(res.body.por_tipo_mes[0]).toHaveProperty('tipo');
        expect(res.body.por_tipo_mes[0]).toHaveProperty('horas');
    });

    it('deve rejeitar sem token', async () => {
        const res = await request(app)
            .get('/api/metricas/horas-por-tipo-mes');

        expect(res.statusCode).toBe(401);
    });

});