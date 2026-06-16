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

describe('GET /api/perfil', () => {

    it('deve buscar o perfil do usuário logado', async () => {
        const res = await request(app)
            .get('/api/perfil')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.usuario).toHaveProperty('nome', 'Usuário Teste');
        expect(res.body.usuario).toHaveProperty('email', 'teste@email.com');
    });

    it('deve rejeitar busca sem token', async () => {
        const res = await request(app)
            .get('/api/perfil');

        expect(res.statusCode).toBe(401);
    });

});

describe('PUT /api/perfil', () => {

    it('deve atualizar o nome com sucesso', async () => {
        const res = await request(app)
            .put('/api/perfil')
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: 'Nome Atualizado' });

        expect(res.statusCode).toBe(200);
        expect(res.body.usuario.nome).toBe('Nome Atualizado');
    });

    it('deve atualizar o email com sucesso', async () => {
        const res = await request(app)
            .put('/api/perfil')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: 'novo@email.com' });

        expect(res.statusCode).toBe(200);
        expect(res.body.usuario.email).toBe('novo@email.com');
    });

    it('deve rejeitar email já em uso por outro usuário', async () => {
        // Cria outro usuário com email diferente
        await request(app)
            .post('/api/auth/register')
            .send({
                nome: 'Outro Usuário',
                email: 'outro@email.com',
                senha: 'senha123'
            });

        const res = await request(app)
            .put('/api/perfil')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: 'outro@email.com' });

        expect(res.statusCode).toBe(400);
    });

    it('deve rejeitar atualização sem token', async () => {
        const res = await request(app)
            .put('/api/perfil')
            .send({ nome: 'Nome Atualizado' });

        expect(res.statusCode).toBe(401);
    });

});

describe('PUT /api/perfil/senha', () => {

    it('deve alterar a senha com sucesso', async () => {
        const res = await request(app)
            .put('/api/perfil/senha')
            .set('Authorization', `Bearer ${token}`)
            .send({
                senha_atual: 'senha123',
                nova_senha: 'novaSenha456'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Senha alterada com sucesso!');
    });

    it('deve rejeitar senha atual incorreta', async () => {
        const res = await request(app)
            .put('/api/perfil/senha')
            .set('Authorization', `Bearer ${token}`)
            .send({
                senha_atual: 'senhaerrada',
                nova_senha: 'novaSenha456'
            });

        expect(res.statusCode).toBe(400);
    });

    it('deve rejeitar sem senha_atual', async () => {
        const res = await request(app)
            .put('/api/perfil/senha')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nova_senha: 'novaSenha456'
            });

        expect(res.statusCode).toBe(400);
    });

    it('deve rejeitar sem nova_senha', async () => {
        const res = await request(app)
            .put('/api/perfil/senha')
            .set('Authorization', `Bearer ${token}`)
            .send({
                senha_atual: 'senha123'
            });

        expect(res.statusCode).toBe(400);
    });

    it('deve rejeitar alteração sem token', async () => {
        const res = await request(app)
            .put('/api/perfil/senha')
            .send({
                senha_atual: 'senha123',
                nova_senha: 'novaSenha456'
            });

        expect(res.statusCode).toBe(401);
    });

});

describe('DELETE /api/perfil', () => {

    it('deve deletar a conta com sucesso', async () => {
        const res = await request(app)
            .delete('/api/perfil')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Conta deletada com sucesso.');
    });

    it('deve rejeitar deleção sem token', async () => {
        const res = await request(app)
            .delete('/api/perfil');

        expect(res.statusCode).toBe(401);
    });

});