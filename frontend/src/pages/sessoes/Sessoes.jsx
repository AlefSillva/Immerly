import { useState, useEffect } from 'react';
import api from '../../services/api';
import FormSessao from '../../components/formSessao/FormSessao';
import TabelaSessoes from '../../components/tabelaSessoes/TabelaSessoes';
import { useToastContext } from '../../contexts/ToastContext';
import styles from './Sessoes.module.css';
    
function Sessoes() {
    const { adicionarToast } = useToastContext();
    const [sessoes, setSessoes] = useState([]);
    const [erro, setErro] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [modalDeletar, setModalDeletar] = useState(null);
    const [sessaoEditando, setSessaoEditando] = useState(null);
    const [formEdicao, setFormEdicao] = useState({
        nome_conteudo: '',
        tipo: '',
        duracao_minutos: '',
        nivel_estimado: '',
        grau_compreensao: '',
    });

    const buscarSessoes = async () => {
        try {
            const resposta = await api.get('/sessoes');
            setSessoes(resposta.data.sessoes);
        } catch (err) {
            setErro(err.response?.data?.message || 'Erro ao carregar sessões');
        }
    };

    useEffect(() => {
        buscarSessoes();
    }, []);

    const sessoesFiltradas = sessoes.filter((sessao) => {
        const data = new Date(sessao.data);
        const inicio = dataInicio ? new Date(dataInicio) : null;
        const fim = dataFim ? new Date(dataFim) : null;
        if (inicio && data < inicio) return false;
        if (fim && data > fim) return false;
        return true;
    });

     // Abre modal de edição com os dados da sessão preenchidos
    const handleEditar = (sessao) => {
        setSessaoEditando(sessao);
        setFormEdicao({
            nome_conteudo: sessao.nome_conteudo,
            tipo: sessao.tipo,
            duracao_minutos: sessao.duracao_minutos,
            nivel_estimado: sessao.nivel_estimado,
            grau_compreensao: sessao.grau_compreensao,
        });
    };

    const handleChangeEdicao = (e) => {
        setFormEdicao({ ...formEdicao, [e.target.name]: e.target.value });
    };

    const handleSubmitEdicao = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/sessoes/${sessaoEditando.id}`, formEdicao);
            adicionarToast('Sessão atualizada com sucesso!', 'sucesso');
            setSessaoEditando(null);
            buscarSessoes();
        } catch (err) {
            adicionarToast(err.response?.data?.message || 'Erro ao atualizar sessão.', 'erro');
        }
    };

    const handleDeletar = async () => {
        try {
            await api.delete(`/sessoes/${modalDeletar}`);
            adicionarToast('Sessão deletada com sucesso!', 'sucesso');
            setModalDeletar(null);
            buscarSessoes();
        } catch (err) {
            adicionarToast(err.response?.data?.message || 'Erro ao deletar sessão.', 'erro');
        }
    };

    return (
        <div className={ styles.container }>
            <h1 className={ styles.titulo }>Sessão</h1>
            <p className={ styles.subtitulo }>Registre sua sessão de imersão</p>
            
            <FormSessao onSucesso={buscarSessoes} />

            <h2 className={styles.tituloHistorico}>Histórico de Sessões</h2>
            
            <div className={styles.filtros}>
                <div className={styles.filtroGrupo}>
                    <label className={styles.filtroLabel}>De</label>
                    <input
                        type="date"
                        className={styles.filtroInput}
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                    />
                </div>
                <div className={styles.filtroGrupo}>
                    <label className={styles.filtroLabel}>Até</label>
                    <input
                        type="date"
                        className={styles.filtroInput}
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                    />
                </div>
                {(dataInicio || dataFim) && (
                    <button
                        className={styles.filtroClear}
                        onClick={() => { setDataInicio(''); setDataFim(''); }}
                    >
                        Limpar filtro
                    </button>
                )}
            </div>

            {erro && <p className={ styles.erro }>{ erro }</p> }

            <TabelaSessoes
                sessoes={sessoesFiltradas}
                onEditar={handleEditar}
                onDeletar={(id) => setModalDeletar(id)}
            />
            
            {/* Modal de confirmação de deletar */}
            {modalDeletar && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitulo}>Deletar sessão</h3>
                        <p className={styles.modalTexto}>Tem certeza que deseja deletar esta sessão? Esta ação é irreversível.</p>
                        <div className={styles.modalBotoes}>
                            <button onClick={() => setModalDeletar(null)} className={styles.botaoCancelar}>Cancelar</button>
                            <button onClick={handleDeletar} className={styles.botaoDeletar}>Sim, deletar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de edição */}
            {sessaoEditando && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitulo}>Editar sessão</h3>
                        <form onSubmit={handleSubmitEdicao} className={styles.formEdicao}>
                            <div className={styles.grupo}>
                                <label className={styles.label}>Conteúdo</label>
                                <input className={styles.input} type="text" name="nome_conteudo" value={formEdicao.nome_conteudo} onChange={handleChangeEdicao} required />
                            </div>
                            <div className={styles.grupo}>
                                <label className={styles.label}>Tipo</label>
                                <select className={styles.input} name="tipo" value={formEdicao.tipo} onChange={handleChangeEdicao} required>
                                    <option value="filme">Filme</option>
                                    <option value="serie">Série</option>
                                    <option value="podcast">Podcast</option>
                                    <option value="video">Vídeo</option>
                                    <option value="livro">Livro</option>
                                    <option value="musica">Música</option>
                                    <option value="artigo">Artigo</option>
                                </select>
                            </div>
                            <div className={styles.grupo}>
                                <label className={styles.label}>Duração (min)</label>
                                <input className={styles.input} type="number" name="duracao_minutos" value={formEdicao.duracao_minutos} onChange={handleChangeEdicao} min="1" required />
                            </div>
                            <div className={styles.grupo}>
                                <label className={styles.label}>Nível</label>
                                <select className={styles.input} name="nivel_estimado" value={formEdicao.nivel_estimado} onChange={handleChangeEdicao} required>
                                    <option value="A1">A1</option>
                                    <option value="A2">A2</option>
                                    <option value="B1">B1</option>
                                    <option value="B2">B2</option>
                                    <option value="C1">C1</option>
                                </select>
                            </div>
                            <div className={styles.grupo}>
                                <label className={styles.label}>Grau de compreensão</label>
                                <select className={styles.input} name="grau_compreensao" value={formEdicao.grau_compreensao} onChange={handleChangeEdicao} required>
                                    <option value="1">Pouco (0-25%)</option>
                                    <option value="2">Metade (26-50%)</option>
                                    <option value="3">A maioria (51-75%)</option>
                                    <option value="4">Quase tudo (76-90%)</option>
                                    <option value="5">Tudo (91-100%)</option>
                                </select>
                            </div>
                            <div className={styles.modalBotoes}>
                                <button type="button" onClick={() => setSessaoEditando(null)} className={styles.botaoCancelar}>Cancelar</button>
                                <button type="submit" className={styles.botaoSalvar}>Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sessoes;