import { useState, useEffect } from 'react';
import api from '../../services/api';
import FormSessao from '../../components/formSessao/FormSessao';
import TabelaSessoes from '../../components/tabelaSessoes/TabelaSessoes';
import styles from './Sessoes.module.css';
    
function Sessoes() {
    const [sessoes, setSessoes] = useState([]);
    const [erro, setErro] = useState('');

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

    return (
        <div className={ styles.container }>
            <h1 className={ styles.titulo }>Sessão</h1>
            <p className={ styles.subtitulo }>Registre sua sessão de imersão</p>
            
            <FormSessao onSucesso={buscarSessoes} />

            <h2 className={styles.tituloHistorico}>Histórico de Sessões</h2>
            
            {erro && <p className={ styles.erro }>{ erro }</p> }

            <TabelaSessoes sessoes={ sessoes} />
        </div>
    );
}

export default Sessoes;