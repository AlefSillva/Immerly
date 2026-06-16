const request = require('supertest');
const app = require('../index');
const pool = require('../config/db');

let token;
let tokenAdmin;

beforeEach(async () => {
    await pool.query('DELETE FROM recursos');
    await pool.query('DELETE FROM sessoes');
    await pool.query('DELETE FROM metas');
    await pool.query('DELETE FROM usuarios');

    // Usuário comum
    const res = await request(app)
        .post('/api/auth/register')
        .send({
            nome: 'Usuário Teste',
            email: 'teste@email.com',
            senha: 'senha123'
        });
    token = res.body.token;

    // Usuário admin — cria e promove direto no banco
    const resAdmin = await request(app)
        .post('/api/auth/register')
        .send({
            nome: 'Admin Teste',
            email: 'admin@email.com',
            senha: 'senha123'
        });
    tokenAdmin = resAdmin.body.token;

    // Promove para admin direto no banco
    await pool.query(
        'UPDATE usuarios SET is_admin = TRUE WHERE email = $1',
        ['admin@email.com']
    );
});

afterAll(async () => {
    await pool.end();
});

describe('GET /api/recursos', () => {

    it('deve listar recursos com autenticação', async () => {
        const res = await request(app)
            .get('/api/recursos')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('recursos');
    });

    it('deve rejeitar listagem sem token', async () => {
        const res = await request(app)
            .get('/api/recursos');

        expect(res.statusCode).toBe(401);
    });

    it('deve filtrar recursos por nível', async () => {
        await request(app)
            .post('/api/admin/recursos')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                nome: 'BBC Learning English',
                tipo: 'listening',
                nivel: 'B1',
                descricao: 'Ótimo recurso',
                link_externo: 'https://bbc.co.uk/learningenglish'
            });

        const res = await request(app)
            .get('/api/recursos?nivel=B1')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.recursos.length).toBeGreaterThan(0);
        expect(res.body.recursos[0].nivel).toBe('B1');
    });

});

describe('GET /api/admin/recursos', () => {

    it('deve listar recursos como admin', async () => {
        const res = await request(app)
            .get('/api/admin/recursos')
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(200);
    });

    it('deve rejeitar listagem sem token', async () => {
        const res = await request(app)
            .get('/api/admin/recursos');

        expect(res.statusCode).toBe(401);
    });

    it('deve rejeitar listagem com usuário comum', async () => {
        const res = await request(app)
            .get('/api/admin/recursos')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(403);
    });

});

describe('POST /api/admin/recursos', () => {

    it('deve criar um recurso como admin', async () => {
        const res = await request(app)
            .post('/api/admin/recursos')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                nome: 'BBC Learning English',
                tipo: 'listening',
                nivel: 'B1',
                descricao: 'Ótimo recurso',
                link_externo: 'https://bbc.co.uk/learningenglish'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
    });

    it('deve rejeitar criação sem token', async () => {
        const res = await request(app)
            .post('/api/admin/recursos')
            .send({
                nome: 'BBC Learning English',
                tipo: 'listening',
                nivel: 'B1',
                descricao: 'Ótimo recurso',
                link_externo: 'https://bbc.co.uk/learningenglish'
            });

        expect(res.statusCode).toBe(401);
    });

    it('deve rejeitar criação com usuário comum', async () => {
        const res = await request(app)
            .post('/api/admin/recursos')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'BBC Learning English',
                tipo: 'listening',
                nivel: 'B1',
                descricao: 'Ótimo recurso',
                link_externo: 'https://bbc.co.uk/learningenglish'
            });

        expect(res.statusCode).toBe(403);
    });

});

describe('PUT /api/admin/recursos/:id', () => {

    let recursoId;

    beforeEach(async () => {
        const res = await request(app)
            .post('/api/admin/recursos')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                nome: 'BBC Learning English',
                tipo: 'listening',
                nivel: 'B1',
                descricao: 'Ótimo recurso',
                link_externo: 'https://bbc.co.uk/learningenglish'
            });
        recursoId = res.body.id;
    });

    it('deve atualizar um recurso como admin', async () => {
        const res = await request(app)
            .put(`/api/admin/recursos/${recursoId}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                nome: 'BBC Learning English Atualizado',
                tipo: 'listening',
                nivel: 'B2',
                descricao: 'Recurso atualizado',
                link_externo: 'https://bbc.co.uk/learningenglish'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.nome).toBe('BBC Learning English Atualizado');
    });

    it('deve rejeitar atualização de recurso inexistente', async () => {
        const res = await request(app)
            .put('/api/admin/recursos/999999')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                nome: 'BBC Learning English',
                tipo: 'listening',
                nivel: 'B1',
                descricao: 'Ótimo recurso',
                link_externo: 'https://bbc.co.uk/learningenglish'
            });

        expect(res.statusCode).toBe(404);
    });

    it('deve rejeitar atualização com usuário comum', async () => {
        const res = await request(app)
            .put(`/api/admin/recursos/${recursoId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'BBC Learning English',
                tipo: 'listening',
                nivel: 'B1',
                descricao: 'Ótimo recurso',
                link_externo: 'https://bbc.co.uk/learningenglish'
            });

        expect(res.statusCode).toBe(403);
    });

});

describe('DELETE /api/admin/recursos/:id', () => {

    let recursoId;

    beforeEach(async () => {
        const res = await request(app)
            .post('/api/admin/recursos')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                nome: 'BBC Learning English',
                tipo: 'listening',
                nivel: 'B1',
                descricao: 'Ótimo recurso',
                link_externo: 'https://bbc.co.uk/learningenglish'
            });
        recursoId = res.body.id;
    });

    it('deve deletar um recurso como admin', async () => {
        const res = await request(app)
            .delete(`/api/admin/recursos/${recursoId}`)
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(200);
    });

    it('deve rejeitar deleção de recurso inexistente', async () => {
        const res = await request(app)
            .delete('/api/admin/recursos/999999')
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(404);
    });

    it('deve rejeitar deleção com usuário comum', async () => {
        const res = await request(app)
            .delete(`/api/admin/recursos/${recursoId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(403);
    });

});