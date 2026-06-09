import { useState, useEffect } from 'react';
import api from '../../services/api';
import CardEstatistica from '../../components/cards/cardEstatistica/CardEstatistica';
import { useToastContext } from '../../contexts/ToastContext';
import SkeletonEstatisticas from '../../components/skeleton/skeletonEstatisticas/SkeletonEstatisticas';
import styles from './Estatisticas.module.css';

function Estatisticas() {
    const { adicionarToast } = useToastContext();

    const [sessoes, setSessoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const buscarSessoes = async () => {
            try {
                const resposta = await api.get('/sessoes');
                setSessoes(resposta.data.sessoes);
            } catch (err) {
                adicionarToast(err.response?.data?.message || 'Erro ao carregar dados.', 'erro');
            } finally {
                setCarregando(false);
            }
        };
        buscarSessoes();
    }, []);

    // Total de sessões
    const totalSessoes = sessoes.length;

    // Tipo favorito
    const tipoFavorito = () => {
        if (!sessoes.length) return '-';
        const contagem = {};
        sessoes.forEach(s => {
            contagem[s.tipo] = (contagem[s.tipo] || 0) + 1;
        });
        return Object.entries(contagem).sort((a, b) => b[1] - a[1])[0][0];
    };

    // Melhor dia da semana
    const melhorDia = () => {
        if (!sessoes.length) return '-';
        const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const contagem = {};
        sessoes.forEach(s => {
            const dia = new Date(s.data).getDay();
            contagem[dia] = (contagem[dia] || 0) + s.duracao_minutos;
        });
        const melhor = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0][0];
        return dias[melhor];
    };

    // Conteúdo mais longo
    const conteudoMaisLongo = () => {
        if (!sessoes.length) return '-';
        return sessoes.reduce((max, s) => s.duracao_minutos > max.duracao_minutos ? s : max).nome_conteudo;
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.titulo}>Estatísticas</h1>
            <p className={styles.subtitulo}>Análise detalhada da sua imersão</p>

            {carregando ? (
                <SkeletonEstatisticas />
            ) : (
                <div className={styles.cards}>
                    <CardEstatistica valor={totalSessoes} label="Total de sessões" />
                    <CardEstatistica valor={tipoFavorito()} label="Tipo favorito" />
                    <CardEstatistica valor={melhorDia()} label="Melhor dia da semana" />
                    <CardEstatistica valor={conteudoMaisLongo()} label="Conteúdo mais longo" />
                </div>
            )}
        </div>
    );
}

export default Estatisticas;