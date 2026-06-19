import { useState } from 'react';
import useSessoes from '../../hooks/useSessoes';
import FormSessao from '../../components/formSessao/FormSessao';
import TabelaSessoes from '../../components/tabelaSessoes/TabelaSessoes';
import CampoTexto from '../../components/formSessao/campoTexto/CampoTexto';
import CampoSelect from '../../components/formSessao/campoSelect/CampoSelect';
import CampoMinutos from '../../components/formSessao/campoMinutos/CampoMinutos';
import { opcoesTipo, opcoesNivel, opcoesGrauCompreensao } from '../../constants/opcoesSessao';
import styles from './Sessoes.module.css';


// Opções de filtro por tipo incluindo "Todos"
const opcoesFiltroTipo = [
    { value: '', label: 'Todos' },
    ...opcoesTipo,
];

function Sessoes() {
    const {
        sessoes,
        filtroTipo,
        dataInicio,
        dataFim,
        paginaAtual,
        totalPaginas,
        total,
        buscarSessoes,
        editarSessao,
        deletarSessao,
        handleFiltroTipo,
        handleDataInicio,
        handleDataFim,
        limparFiltros,
        setPaginaAtual,
    } = useSessoes();

    
    const [modalDeletar, setModalDeletar] = useState(null);
    const [sessaoEditando, setSessaoEditando] = useState(null);
    const [formEdicao, setFormEdicao] = useState({
        nome_conteudo: '',
        tipo: '',
        duracao_minutos: '',
        nivel_estimado: '',
        grau_compreensao: '',
    });

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
        const sucesso = await editarSessao(sessaoEditando.id, formEdicao);
        if (sucesso) setSessaoEditando(null);
    };

    const handleDeletar = async () => {
        const sucesso = await deletarSessao(modalDeletar);
        if (sucesso) setModalDeletar(null);
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
                        onChange={(e) => handleDataInicio(e.target.value)}
                    />
                </div>
                <div className={styles.filtroGrupo}>
                    <label className={styles.filtroLabel}>Até</label>
                    <input
                        type="date"
                        className={styles.filtroInput}
                        value={dataFim}
                        onChange={(e) => handleDataFim(e.target.value)}
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
                        onClick={limparFiltros}
                    >
                        Limpar filtros
                    </button>
                )}
            </div>

            <p className={styles.totalSessoes}>{total} sessão(ões) encontrada(s)</p>

            <TabelaSessoes
                sessoes={sessoes}
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