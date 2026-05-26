import { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './Perfil.module.css';

function Perfil() {
    const [usuario, setUsuario] = useState(null);
    const [formPerfil, setFormPerfil] = useState({ nome: '', email: '' });
    const [formSenha, setFormSenha] = useState({ senha_atual: '', nova_senha: '', confirmar_senha: '' });
    const [mensagemPerfil, setMensagemPerfil] = useState('');
    const [erroPerfil, setErroPerfil] = useState('');
    const [mensagemSenha, setMensagemSenha] = useState('');
    const [erroSenha, setErroSenha] = useState('');
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const buscarPerfil = async () => {
            try {
                const resposta = await api.get('/perfil');
                setUsuario(resposta.data.usuario);
                setFormPerfil({
                    nome: resposta.data.usuario.nome,
                    email: resposta.data.usuario.email
                });
            } catch (err) {
                setErroPerfil(err.response?.data?.message || 'Erro ao carregar perfil.');
            } finally {
                setCarregando(false);
            }
        };

        buscarPerfil();
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

            // Atualiza o localStorage com os novos dados
            const usuarioAtual = JSON.parse(localStorage.getItem('usuario'));
            localStorage.setItem('usuario', JSON.stringify({
                ...usuarioAtual,
                nome: resposta.data.usuario.nome,
                email: resposta.data.usuario.email
            }));

            setUsuario(resposta.data.usuario);
            setMensagemPerfil('Perfil atualizado com sucesso!');
            setTimeout(() => setMensagemPerfil(''), 3000);

        } catch (err) {
            setErroPerfil(err.response?.data?.message || 'Erro ao atualizar perfil.');
        }
    };

    const handleSubmitSenha = async (e) => {
        e.preventDefault();
        setErroSenha('');
        setMensagemSenha('');

        // Valida se as senhas coincidem antes de enviar
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

    return (
        <div className={styles.container}>
            <h1 className={styles.titulo}>Meu Perfil</h1>
            <p className={styles.subtitulo}>Gerencie suas informações pessoais</p>

            {/* Informações do perfil */}
            <div className={styles.secao}>
                <h2 className={styles.secaoTitulo}>Informações pessoais</h2>
                <p className={styles.dataCadastro}>
                    Membro desde {new Date(usuario.data_cadastro).toLocaleDateString('pt-BR')}
                </p>

                <form onSubmit={handleSubmitPerfil} className={styles.form}>
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

                    {mensagemPerfil && <p className={styles.sucesso}>{mensagemPerfil}</p>}
                    {erroPerfil && <p className={styles.erro}>{erroPerfil}</p>}

                    <button type="submit" className={styles.botaoSalvar}>
                        Salvar alterações
                    </button>
                </form>
            </div>

            {/* Alteração de senha */}
            <div className={styles.secao}>
                <h2 className={styles.secaoTitulo}>Alterar senha</h2>

                <form onSubmit={handleSubmitSenha} className={styles.form}>
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

                    {mensagemSenha && <p className={styles.sucesso}>{mensagemSenha}</p>}
                    {erroSenha && <p className={styles.erro}>{erroSenha}</p>}

                    <button type="submit" className={styles.botaoSalvar}>
                        Alterar senha
                    </button>
                </form>
            </div>

            {/* Zona de perigo */}
            <div className={styles.secaoDanger}>
                <h2 className={styles.secaoTituloDanger}>Zona de perigo</h2>
                <p className={styles.dangerTexto}>
                    Ao deletar sua conta, todos os seus dados serão permanentemente removidos.
                </p>
                <button onClick={handleDeletarConta} className={styles.botaoDeletar}>
                    Deletar minha conta
                </button>
            </div>
        </div>
    );
}

export default Perfil;