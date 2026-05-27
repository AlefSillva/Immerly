import { useState, useEffect } from 'react';
import api from '../../services/api';
import CardMetrica from '../../components/cards/cardMetrica/CardMetrica';
import CardNivel from '../../components/cards/cardNivel/CardNivel';
import styles from './Perfil.module.css';

function Perfil() {
    const [usuario, setUsuario] = useState(null);
    const [metricas, setMetricas] = useState(null);
    const [editando, setEditando] = useState(false);
    const [alterandoSenha, setAlterandoSenha] = useState(false);
    const [formPerfil, setFormPerfil] = useState({ nome: '', email: '' });
    const [formSenha, setFormSenha] = useState({ senha_atual: '', nova_senha: '', confirmar_senha: '' });
    const [mensagemPerfil, setMensagemPerfil] = useState('');
    const [erroPerfil, setErroPerfil] = useState('');
    const [mensagemSenha, setMensagemSenha] = useState('');
    const [erroSenha, setErroSenha] = useState('');
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const buscarDados = async () => {
            try {
                const [resPerfil, resMetricas] = await Promise.all([
                    api.get('/perfil'),
                    api.get('/metricas')
                ]);
                setUsuario(resPerfil.data.usuario);
                setMetricas(resMetricas.data);
                setFormPerfil({
                    nome: resPerfil.data.usuario.nome,
                    email: resPerfil.data.usuario.email
                });
            } catch (err) {
                setErroPerfil(err.response?.data?.message || 'Erro ao carregar perfil.');
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
        setErroPerfil('');
        setMensagemPerfil('');

        try {
            const resposta = await api.put('/perfil', formPerfil);
            const usuarioAtual = JSON.parse(localStorage.getItem('usuario'));
            localStorage.setItem('usuario', JSON.stringify({
                ...usuarioAtual,
                nome: resposta.data.usuario.nome,
                email: resposta.data.usuario.email
            }));
            setUsuario(resposta.data.usuario);
            setMensagemPerfil('Perfil atualizado com sucesso!');
            setEditando(false);
            setTimeout(() => setMensagemPerfil(''), 3000);
        } catch (err) {
            setErroPerfil(err.response?.data?.message || 'Erro ao atualizar perfil.');
        }
    };

    const handleSubmitSenha = async (e) => {
        e.preventDefault();
        setErroSenha('');
        setMensagemSenha('');

        if (formSenha.nova_senha !== formSenha.confirmar_senha) {
            setErroSenha('As senhas não coincidem.');
            return;
        }

        try {
            await api.put('/perfil/senha', {
                senha_atual: formSenha.senha_atual,
                nova_senha: formSenha.nova_senha
            });
            setMensagemSenha('Senha alterada com sucesso!');
            setFormSenha({ senha_atual: '', nova_senha: '', confirmar_senha: '' });
            setAlterandoSenha(false);
            setTimeout(() => setMensagemSenha(''), 3000);
        } catch (err) {
            setErroSenha(err.response?.data?.message || 'Erro ao alterar senha.');
        }
    };

    const handleDeletarConta = async () => {
        if (!window.confirm('Tem certeza que deseja deletar sua conta? Esta ação é irreversível.')) return;

        try {
            await api.delete('/perfil');
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/landing';
        } catch (err) {
            setErroPerfil(err.response?.data?.message || 'Erro ao deletar conta.');
        }
    };

    if (carregando) return <p className={styles.carregando}>Carregando...</p>;

    // Pega a inicial do nome para o avatar
    const inicial = usuario?.nome?.charAt(0).toUpperCase();

    return (
        <div className={styles.container}>
            <h1 className={styles.titulo}>Meu Perfil</h1>
            <p className={styles.subtitulo}>Gerencie suas informações pessoais</p>

            {/* Card de identidade */}
            <div className={styles.cardIdentidade}>
                <div className={styles.avatar}>{inicial}</div>

                {!editando ? (
                    <div className={styles.infoUsuario}>
                        <h2 className={styles.nomeUsuario}>{usuario.nome}</h2>
                        <p className={styles.emailUsuario}>{usuario.email}</p>
                        <p className={styles.dataCadastro}>
                            Membro desde {new Date(usuario.data_cadastro).toLocaleDateString('pt-BR')}
                        </p>
                        {mensagemPerfil && <p className={styles.sucesso}>{mensagemPerfil}</p>}
                        <button onClick={() => setEditando(true)} className={styles.botaoEditar}>
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
                            <button type="submit" className={styles.botaoSalvar}>Salvar</button>
                            <button type="button" onClick={() => setEditando(false)} className={styles.botaoCancelar}>Cancelar</button>
                        </div>
                    </form>
                )}
            </div>

            {/* Resumo de atividade */}
            {metricas && (
                <div className={styles.secao}>
                    <h2 className={styles.secaoTitulo}>Resumo de atividade</h2>
                    <div className={styles.nivelWrapper}>
                        <CardNivel totalHoras={metricas.total_horas} />
                    </div>
                    <div className={styles.gridMetricas}>
                        <CardMetrica titulo="Total de horas" valor={(metricas.total_horas ?? 0).toFixed(1)} sufixo="h" />
                        <CardMetrica titulo="Streak atual" valor={metricas.streak_dias} sufixo="dias" />
                        <CardMetrica titulo="Média semanal" valor={(metricas.media_semanal_horas ?? 0).toFixed(1)} sufixo="h" />
                        <CardMetrica titulo="Projeção 4 semanas" valor={(metricas.projecao_4_semanas_horas ?? 0).toFixed(1)} sufixo="h" />
                    </div>
                </div>
            )}

            {/* Ações da conta */}
            <div className={styles.secao}>
                <h2 className={styles.secaoTitulo}>Configurações da conta</h2>

                {!alterandoSenha ? (
                    <div className={styles.acoes}>
                        {mensagemSenha && <p className={styles.sucesso}>{mensagemSenha}</p>}
                        <button onClick={() => setAlterandoSenha(true)} className={styles.botaoAcao}>
                            🔒 Alterar senha
                        </button>
                        <button onClick={handleDeletarConta} className={styles.botaoDeletar}>
                            🗑️ Deletar minha conta
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitSenha} className={styles.formInline}>
                        <div className={styles.grupo}>
                            <label className={styles.label}>Senha atual</label>
                            <input className={styles.input} type="password" name="senha_atual" value={formSenha.senha_atual} onChange={handleChangeSenha} required />
                        </div>
                        <div className={styles.grupo}>
                            <label className={styles.label}>Nova senha</label>
                            <input className={styles.input} type="password" name="nova_senha" value={formSenha.nova_senha} onChange={handleChangeSenha} required />
                        </div>
                        <div className={styles.grupo}>
                            <label className={styles.label}>Confirmar nova senha</label>
                            <input className={styles.input} type="password" name="confirmar_senha" value={formSenha.confirmar_senha} onChange={handleChangeSenha} required />
                        </div>
                        {erroSenha && <p className={styles.erro}>{erroSenha}</p>}
                        <div className={styles.botoesForm}>
                            <button type="submit" className={styles.botaoSalvar}>Salvar</button>
                            <button type="button" onClick={() => setAlterandoSenha(false)} className={styles.botaoCancelar}>Cancelar</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Perfil;