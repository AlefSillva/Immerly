const request = require("supertest");
const app = require("../index");
const pool = require("../config/db");

let token;

// Limpa o banco e cria usuário de teste antes de cada teste
beforeEach(async () => {
  await pool.query("DELETE FROM sessoes");
  await pool.query("DELETE FROM metas");
  await pool.query("DELETE FROM usuarios");

  const res = await request(app).post("/api/auth/register").send({
    nome: "Usuário Teste",
    email: "teste@email.com",
    senha: "senha123",
  });

  token = res.body.token;
});

afterAll(async () => {
  await pool.end();
});

describe("POST /api/sessoes", () => {
  it("deve criar uma sessão com sucesso", async () => {
    const res = await request(app)
      .post("/api/sessoes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome_conteudo: "Friends S01E01",
        tipo: "serie",
        duracao_minutos: 25,
        nivel_estimado: "B1",
        grau_compreensao: 4,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.sessao).toHaveProperty("id");
  });

  it("deve rejeitar criação sem token", async () => {
    const res = await request(app).post("/api/sessoes").send({
      nome_conteudo: "Friends S01E01",
      tipo: "serie",
      duracao_minutos: 25,
      nivel_estimado: "B1",
      grau_compreensao: 4,
    });

    expect(res.statusCode).toBe(401);
  });

  it("deve rejeitar criação sem nome_conteudo", async () => {
    const res = await request(app)
      .post("/api/sessoes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        tipo: "serie",
        duracao_minutos: 25,
        nivel_estimado: "B1",
        grau_compreensao: 4,
      });

    expect(res.statusCode).toBe(400);
  });

  it("deve rejeitar tipo inválido", async () => {
    const res = await request(app)
      .post("/api/sessoes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome_conteudo: "Friends S01E01",
        tipo: "invalido",
        duracao_minutos: 25,
        nivel_estimado: "B1",
        grau_compreensao: 4,
      });

    expect(res.statusCode).toBe(400);
  });

  it("deve rejeitar grau_compreensao fora do range", async () => {
    const res = await request(app)
      .post("/api/sessoes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome_conteudo: "Friends S01E01",
        tipo: "serie",
        duracao_minutos: 25,
        nivel_estimado: "B1",
        grau_compreensao: 6,
      });

    expect(res.statusCode).toBe(400);
  });
});

describe("GET /api/sessoes", () => {
  beforeEach(async () => {
    // Cria algumas sessões para testar listagem
    await request(app)
      .post("/api/sessoes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome_conteudo: "Friends",
        tipo: "serie",
        duracao_minutos: 25,
        nivel_estimado: "B1",
        grau_compreensao: 4,
      });

    await request(app)
      .post("/api/sessoes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome_conteudo: "BBC News",
        tipo: "video",
        duracao_minutos: 10,
        nivel_estimado: "B2",
        grau_compreensao: 3,
      });

    await request(app)
      .post("/api/sessoes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome_conteudo: "Harry Potter",
        tipo: "livro",
        duracao_minutos: 60,
        nivel_estimado: "B2",
        grau_compreensao: 4,
      });
  });

  it("deve listar sessões com sucesso", async () => {
    const res = await request(app)
      .get("/api/sessoes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("sessoes");
    expect(res.body.sessoes.length).toBe(3);
  });

  it("deve filtrar sessões por tipo", async () => {
    const res = await request(app)
      .get("/api/sessoes?tipo=serie")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.sessoes.length).toBe(1);
    expect(res.body.sessoes[0].tipo).toBe("serie");
  });

  it("deve retornar paginação correta", async () => {
    const res = await request(app)
      .get("/api/sessoes?page=1&limit=2")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.sessoes.length).toBe(2);
    expect(res.body).toHaveProperty("paginacao");
    expect(res.body.paginacao.total).toBe(3);
    expect(res.body.paginacao.totalPaginas).toBe(2);
  });

  it("deve rejeitar listagem sem token", async () => {
    const res = await request(app).get("/api/sessoes");

    expect(res.statusCode).toBe(401);
  });
});

describe("PUT /api/sessoes/:id", () => {
  let sessaoId;

  beforeEach(async () => {
    const res = await request(app)
      .post("/api/sessoes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome_conteudo: "Friends",
        tipo: "serie",
        duracao_minutos: 25,
        nivel_estimado: "B1",
        grau_compreensao: 4,
      });

    sessaoId = res.body.sessao.id;
  });

  it("deve editar uma sessão com sucesso", async () => {
    const res = await request(app)
      .put(`/api/sessoes/${sessaoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome_conteudo: "Friends Editado",
        tipo: "serie",
        duracao_minutos: 30,
        nivel_estimado: "B1",
        grau_compreensao: 5,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.sessao.nome_conteudo).toBe("Friends Editado");
  });

  it("deve rejeitar edição sem token", async () => {
    const res = await request(app)
      .put(`/api/sessoes/${sessaoId}`)
      .send({
        nome_conteudo: "Friends Editado",
        tipo: "serie",
        duracao_minutos: 30,
        nivel_estimado: "B1",
        grau_compreensao: 5,
      });

    expect(res.statusCode).toBe(401);
  });

  it("deve rejeitar edição de sessão inexistente", async () => {
    const res = await request(app)
      .put("/api/sessoes/999999")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome_conteudo: "Friends Editado",
        tipo: "serie",
        duracao_minutos: 30,
        nivel_estimado: "B1",
        grau_compreensao: 5,
      });

    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /api/sessoes/:id", () => {
  let sessaoId;

  beforeEach(async () => {
    const res = await request(app)
      .post("/api/sessoes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome_conteudo: "Friends",
        tipo: "serie",
        duracao_minutos: 25,
        nivel_estimado: "B1",
        grau_compreensao: 4,
      });

    sessaoId = res.body.sessao.id;
  });

  it("deve deletar uma sessão com sucesso", async () => {
    const res = await request(app)
      .delete(`/api/sessoes/${sessaoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("deve rejeitar deleção sem token", async () => {
    const res = await request(app).delete(`/api/sessoes/${sessaoId}`);

    expect(res.statusCode).toBe(401);
  });

  it("deve rejeitar deleção de sessão inexistente", async () => {
    const res = await request(app)
      .delete("/api/sessoes/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
