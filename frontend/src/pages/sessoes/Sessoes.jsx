import { useState, useEffect } from 'react';
import api from '../../services/api';
import FormSessao from '../../components/formSessao/FormSessao';
import TabelaSessoes from '../../components/tabelaSessoes/TabelaSessoes';
import CampoTexto from '../../components/formSessao/campoTexto/CampoTexto';
import CampoSelect from '../../components/formSessao/campoSelect/CampoSelect';
import CampoMinutos from '../../components/formSessao/campoMinutos/CampoMinutos';
import { opcoesTipo, opcoesNivel, opcoesGrauCompreensao } from '../../constants/opcoesSessao';
import { useToastContext } from '../../contexts/ToastContext';
import styles from './Sessoes.module.css';


// Opções de filtro por tipo incluindo "Todos"
const opcoesFiltroTipo = [
    { value: '', label: 'Todos' },
    ...opcoesTipo,
];

function Sessoes() {
    const { adicionarToast } = useToastContext();
    const [sessoes, setSessoes] = useState([]);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 5;
    const [modalDeletar, setModalDeletar] = useState(null);
    const [sessaoEditando, setSessaoEditando] = useState(null);
    const [formEdicao, setFormEdicao] = useState({
        nome_conteudo: '',
        tipo: '',
        duracao_minutos: '',
        nivel_estimado: '',
        grau_compreensao: '',
    });

    const buscarSessoes = async (page = paginaAtual, tipo = filtroTipo) => {
        try {
            const params = new URLSearchParams({ page, limit });
            if (tipo) params.append('tipo', tipo);

            const resposta = await api.get(`/sessoes?${params.toString()}`);

            setSessoes(resposta.data.sessoes);
            setTotalPaginas(resposta.data.paginacao.totalPaginas);
            setTotal(resposta.data.paginacao.total);

        } catch (err) {
            adicionarToast(err.response?.data?.message || 'Erro ao buscar sessões.', 'erro');
        }
    };

    useEffect(() => {
        buscarSessoes(paginaAtual, filtroTipo);
    }, [paginaAtual, filtroTipo]);

    const sessoesFiltradas = sessoes.filter((sessao) => {
        const data = new Date(sessao.data);
        const inicio = dataInicio ? new Date(dataInicio) : null;
        const fim = dataFim ? new Date(dataFim) : null;
        if (inicio && data < inicio) return false;
        if (fim && data > fim) return false;
        return true;
    });

    // Reseta a página para 1 ao mudar o filtro de tipo
    const handleFiltroTipo = (e) => {
        setFiltroTipo(e.target.value);
        setPaginaAtual(1);
    };

     // Abre o modal de edição com os dados da sessão preenchidos
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

                <div className={styles.filtroGrupo}>
                    <label className={styles.filtroLabel}>Tipo</label>
                    <select
                        className={styles.filtroInput}
                        value={filtroTipo}
                        onChange={handleFiltroTipo}
                    >
                        {opcoesFiltroTipo.map(op => (
                            <option key={op.value} value={op.value}>{op.label}</option>
                        ))}
                    </select>
                </div>

                {(dataInicio || dataFim || filtroTipo) && (
                    <button
                        className={styles.filtroClear}
                        onClick={() => { setDataInicio(''); setDataFim(''); setFiltroTipo(''); }}
                    >
                        Limpar filtros
                    </button>
                )}
            </div>

            <p className={styles.totalSessoes}>{total} sessão(ões) encontrada(s)</p>

            <TabelaSessoes
                sessoes={sessoesFiltradas}
                onEditar={handleEditar}
                onDeletar={(id) => setModalDeletar(id)}
            />

             {/* Paginação */}
            {totalPaginas > 1 && (
                <div className={styles.paginacao}>
                    <button
                        className={styles.botaoPagina}
                        onClick={() => setPaginaAtual(p => p - 1)}
                        disabled={paginaAtual === 1}
                        aria-label="Página anterior"
                    >
                        ← Anterior
                    </button>
                    <span className={styles.paginaInfo}>
                        {paginaAtual} / {totalPaginas}
                    </span>
                    <button
                        className={styles.botaoPagina}
                        onClick={() => setPaginaAtual(p => p + 1)}
                        disabled={paginaAtual === totalPaginas}
                        aria-label="Próxima página"
                    >
                        Próxima →
                    </button>
                </div>
            )}
            
            {/* Modal de confirmação de deletar */}
            {modalDeletar && (
                <div className={styles.modalOverlay}>
                    <div
                        className={styles.modal}
                        role="dialog" aria-modal="true" aria-labelledby="titulo-deletar-sessao"
                    >
                        <h3
                            className={styles.modalTitulo}
                            id="titulo-deletar-sessao"
                        >
                            Deletar sessão</h3>
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
                    <div
                        className={styles.modal}
                        role="dialog" aria-modal="true" aria-labelledby="titulo-editar-sessao"
                    >
                        <h3
                            className={styles.modalTitulo}
                            id="titulo-editar-sessao"
                        >
                            Editar sessão</h3>
                        <form onSubmit={handleSubmitEdicao} className={styles.formEdicao}>
                            <CampoTexto
                                label="Conteúdo"
                                name="nome_conteudo"
                                value={formEdicao.nome_conteudo}
                                onChange={handleChangeEdicao}
                                placeholder="ex: The Rookie S01E01"
                                required
                            />
                            <CampoSelect
                                label="Tipo"
                                name="tipo"
                                value={formEdicao.tipo}
                                onChange={handleChangeEdicao}
                                options={opcoesTipo}
                                required
                            />
                            <CampoMinutos
                                label="Duração (min)"
                                name="duracao_minutos"
                                value={formEdicao.duracao_minutos}
                                onChange={handleChangeEdicao}
                                required
                            />
                            <CampoSelect
                                label="Nível"
                                name="nivel_estimado"
                                value={formEdicao.nivel_estimado}
                                onChange={handleChangeEdicao}
                                options={opcoesNivel}
                                required
                            />
                            <CampoSelect
                                label="Grau de compreensão"
                                name="grau_compreensao"
                                value={formEdicao.grau_compreensao}
                                onChange={handleChangeEdicao}
                                options={opcoesGrauCompreensao}
                                required
                            />
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