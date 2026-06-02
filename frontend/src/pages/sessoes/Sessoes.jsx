import { useState, useEffect } from 'react';
import api from '../../services/api';
import FormSessao from '../../components/formSessao/FormSessao';
import TabelaSessoes from '../../components/tabelaSessoes/TabelaSessoes';
import styles from './Sessoes.module.css';
    
function Sessoes() {
    const [sessoes, setSessoes] = useState([]);
    const [erro, setErro] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

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

            <TabelaSessoes sessoes={ sessoesFiltradas } />
        </div>
    );
}

export default Sessoes;