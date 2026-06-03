import { useState, useEffect } from "react";
import api from "../../services/api";
import MetricasPerfil from "../../components/perfilComponents/metricasPerfil/MetricasPerfil";
import NivelPerfil from "../../components/perfilComponents/nivelPerfil/NivelPerfil";
import { useToastContext } from "../../contexts/ToastContext";
import styles from "./Perfil.module.css";

function Perfil() {
  const { adicionarToast } = useToastContext();
  const [usuario, setUsuario] = useState(null);
  const [metricas, setMetricas] = useState(null);
  const [editando, setEditando] = useState(false);
  const [alterandoSenha, setAlterandoSenha] = useState(false);
  const [formPerfil, setFormPerfil] = useState({ nome: "", email: "" });
  const [formSenha, setFormSenha] = useState({
    senha_atual: "",
    nova_senha: "",
    confirmar_senha: "",
  });
  const [erroPerfil, setErroPerfil] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [modalDeletar, setModalDeletar] = useState(false);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const [resPerfil, resMetricas] = await Promise.all([
          api.get("/perfil"),
          api.get("/metricas"),
        ]);
        setUsuario(resPerfil.data.usuario);
        setMetricas(resMetricas.data);
        setFormPerfil({
          nome: resPerfil.data.usuario.nome,
          email: resPerfil.data.usuario.email,
        });
      } catch (err) {
        setErroPerfil(
          err.response?.data?.message || "Erro ao carregar perfil.",
        );
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, []);

  const handleChangePerfil = (e) => {
    setFormPerfil({ ...formPerfil, [e.target.name]: e.target.value });
  };

  const handleChangeSenha = (e) => {
    setFormSenha({ ...formSenha, [e.target.name]: e.target.value });
  };

  const handleSubmitPerfil = async (e) => {
    e.preventDefault();
    setErroPerfil("");

    try {
      const resposta = await api.put("/perfil", formPerfil);
      const usuarioAtual = JSON.parse(localStorage.getItem("usuario"));
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          ...usuarioAtual,
          nome: resposta.data.usuario.nome,
          email: resposta.data.usuario.email,
        }),
      );
      setUsuario(resposta.data.usuario);
      adicionarToast("Perfil atualizado com sucesso!", "sucesso");
      setEditando(false);
    } catch (err) {
      setErroPerfil(err.response?.data?.message || "Erro ao atualizar perfil.");
    }
  };

  const handleSubmitSenha = async (e) => {
    e.preventDefault();
    setErroSenha("");

    if (formSenha.nova_senha !== formSenha.confirmar_senha) {
      setErroSenha("As senhas não coincidem.");
      return;
    }

    try {
      await api.put("/perfil/senha", {
        senha_atual: formSenha.senha_atual,
        nova_senha: formSenha.nova_senha,
      });
      setFormSenha({ senha_atual: "", nova_senha: "", confirmar_senha: "" });
      setAlterandoSenha(false);
      adicionarToast("Senha alterada com sucesso!", "sucesso");
    } catch (err) {
      setErroSenha(err.response?.data?.message || "Erro ao alterar senha.");
    }
  };

  const handleDeletarConta = async () => {
    try {
      await api.delete("/perfil");
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/landing";
    } catch (err) {
      adicionarToast(
        err.response?.data?.message || "Erro ao deletar conta.",
        "erro",
      );
    }
  };

  if (carregando) return <p className={styles.carregando}>Carregando...</p>;

  // Pega a inicial do nome para o avatar
  const inicial = usuario?.nome?.charAt(0).toUpperCase();

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Meu Perfil</h1>
      <p className={styles.subtitulo}>Gerencie suas informações pessoais</p>

      <div className={styles.cardIdentidade}>
        <div className={styles.avatar}>{inicial}</div>

        {!editando ? (
          <div className={styles.infoUsuario}>
            <h2 className={styles.nomeUsuario}>{usuario.nome}</h2>
            <p className={styles.emailUsuario}>{usuario.email}</p>
            <p className={styles.dataCadastro}>
              Membro desde{" "}
              {new Date(usuario.data_cadastro).toLocaleDateString("pt-BR")}
            </p>
            
            <button
              onClick={() => setEditando(true)}
              className={styles.botaoEditar}
            >
              Editar informações
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitPerfil} className={styles.formInline}>
            <div className={styles.grupo}>
              <label className={styles.label}>Nome</label>
              <input
                className={styles.input}
                type="text"
                name="nome"
                value={formPerfil.nome}
                onChange={handleChangePerfil}
                required
              />
            </div>
            <div className={styles.grupo}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                name="email"
                value={formPerfil.email}
                onChange={handleChangePerfil}
                required
              />
            </div>
            {erroPerfil && <p className={styles.erro}>{erroPerfil}</p>}
            <div className={styles.botoesForm}>
              <button type="submit" className={styles.botaoSalvar}>
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setEditando(false)}
                className={styles.botaoCancelar}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {metricas && (
        <div className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Resumo de atividade</h2>
          <NivelPerfil totalHoras={metricas.total_horas} />
          <MetricasPerfil
            totalHoras={metricas.total_horas ?? 0}
            streakDias={metricas.streak_dias}
            mediaSemanal={metricas.media_semanal_horas ?? 0}
            projecao={metricas.projecao_4_semanas_horas ?? 0}
          />
        </div>
      )}

      <div className={styles.secao}>
        <h2 className={styles.secaoTitulo}>Configurações da conta</h2>

        {!alterandoSenha ? (
          <div className={styles.acoes}>
            <button
              onClick={() => setAlterandoSenha(true)}
              className={styles.botaoAcao}
            >
              🔒 Alterar senha
            </button>
            <button
              onClick={() => setModalDeletar(true)}
              className={styles.botaoDeletar}
            >
              🗑️ Deletar minha conta
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitSenha} className={styles.formInline}>
            <div className={styles.grupo}>
              <label className={styles.label}>Senha atual</label>
              <input
                className={styles.input}
                type="password"
                name="senha_atual"
                value={formSenha.senha_atual}
                onChange={handleChangeSenha}
                required
              />
            </div>
            <div className={styles.grupo}>
              <label className={styles.label}>Nova senha</label>
              <input
                className={styles.input}
                type="password"
                name="nova_senha"
                value={formSenha.nova_senha}
                onChange={handleChangeSenha}
                required
              />
            </div>
            <div className={styles.grupo}>
              <label className={styles.label}>Confirmar nova senha</label>
              <input
                className={styles.input}
                type="password"
                name="confirmar_senha"
                value={formSenha.confirmar_senha}
                onChange={handleChangeSenha}
                required
              />
            </div>
            {erroSenha && <p className={styles.erro}>{erroSenha}</p>}
            <div className={styles.botoesForm}>
              <button type="submit" className={styles.botaoSalvar}>
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setAlterandoSenha(false)}
                className={styles.botaoCancelar}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
      {modalDeletar && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitulo}>Deletar conta</h3>
            <p className={styles.modalTexto}>
              Tem certeza? Esta ação é irreversível e todos os seus dados serão
              perdidos.
            </p>
            <div className={styles.modalBotoes}>
              <button
                onClick={() => setModalDeletar(false)}
                className={styles.botaoCancelar}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletarConta}
                className={styles.botaoDeletar}
              >
                Sim, deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;
