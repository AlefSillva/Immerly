import { useState, useEffect } from 'react';
import api from '../../services/api';
import CardEstatistica from '../../components/cards/cardEstatistica/CardEstatistica';
import { useToastContext } from '../../contexts/ToastContext';
import SkeletonEstatisticas from '../../components/skeleton/skeletonEstatisticas/SkeletonEstatisticas';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend
} from 'recharts';
import styles from './Estatisticas.module.css';

const CORES_TIPOS = {
    filme: '#6c63ff',
    serie: '#FF521B',
    podcast: '#4caf50',
    video: '#2196f3',
    livro: '#ff9800',
    musica: '#e91e63',
    artigo: '#00BCD4',
};

function Estatisticas() {
    const { adicionarToast } = useToastContext();
    const [sessoes, setSessoes] = useState([]);
    const [porMes, setPorMes] = useState([]);
    const [porTipoMes, setPorTipoMes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const buscarDados = async () => {
            try {
                const [resSessoes, resPorMes, resPorTipoMes] = await Promise.all([
                    api.get('/sessoes'),
                    api.get('/metricas/horas-por-mes'),
                    api.get('/metricas/horas-por-tipo-mes'),
                ]);
                setSessoes(resSessoes.data.sessoes);
                setPorMes(resPorMes.data.por_mes);
                setPorTipoMes(resPorTipoMes.data.por_tipo_mes);
            } catch (err) {
                adicionarToast(err.response?.data?.message || 'Erro ao carregar dados.', 'erro');
            } finally {
                setCarregando(false);
            }
        };
        buscarDados();
    }, [adicionarToast]);

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

    // Dados formatados pro gráfico de barras
    const dadosPorMes = porMes.map(item => ({
        mes: item.mes,
        horas: parseFloat(item.horas),
    }));

     // Dados formatados pro gráfico de linha — agrupa por mês com cada tipo como chave
    const tiposUnicos = [...new Set(porTipoMes.map(item => item.tipo))];
    const mesesUnicos = [...new Set(porTipoMes.map(item => item.mes))];
    const dadosPorTipoMes = mesesUnicos.map(mes => {
        const ponto = { mes };
        tiposUnicos.forEach(tipo => {
            const encontrado = porTipoMes.find(item => item.mes === mes && item.tipo === tipo);
            ponto[tipo] = encontrado ? parseFloat(encontrado.horas) : 0;
        });
        return ponto;
    });

    // Estilos do tooltip baseados no tema
    const temaAtual = localStorage.getItem('tema');
    const estiloTooltip = temaAtual === 'escuro'
        ? { backgroundColor: '#1e1e2e', border: '1px solid #3a3a5c', color: '#ffffff' }
        : { backgroundColor: '#E5D4C0', border: '1px solid #2A4849', color: '#2A4849' };
    const estiloLabel = temaAtual === 'escuro' ? { color: '#ffffff' } : { color: '#2A4849' };

    return (
        <div className={styles.container}>
            <h1 className={styles.titulo}>Estatísticas</h1>
            <p className={styles.subtitulo}>Análise detalhada da sua imersão</p>

            {carregando ? (
                <SkeletonEstatisticas />
            ) : (
                <>
                    <div className={styles.cards}>
                        <CardEstatistica valor={totalSessoes} label="Total de sessões" />
                        <CardEstatistica valor={tipoFavorito()} label="Tipo favorito" />
                        <CardEstatistica valor={melhorDia()} label="Melhor dia da semana" />
                        <CardEstatistica valor={conteudoMaisLongo()} label="Conteúdo mais longo" />
                    </div>
                    
                    {dadosPorMes.length > 0 && (
                        <div className={styles.grafico}>
                            <h2 className={styles.tituloGrafico}>Horas por mês</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={dadosPorMes}>
                                    <XAxis dataKey="mes" stroke="#a0a0a0" />
                                    <YAxis stroke="#a0a0a0" />
                                    <Tooltip
                                        contentStyle={estiloTooltip}
                                        labelStyle={estiloLabel}
                                        itemStyle={estiloLabel}
                                        formatter={(value) => [`${value}h`, 'Horas']}
                                    />
                                    <Bar dataKey="horas" fill="#6c63ff" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        )}
                        
                    {dadosPorTipoMes.length > 0 && (
                        <div className={styles.grafico}>
                            <h2 className={styles.tituloGrafico}>Horas por tipo ao longo do tempo</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={dadosPorTipoMes}>
                                    <XAxis dataKey="mes" stroke="#a0a0a0" />
                                    <YAxis stroke="#a0a0a0" />
                                    <Tooltip
                                        contentStyle={estiloTooltip}
                                        labelStyle={estiloLabel}
                                        itemStyle={estiloLabel}
                                        formatter={(value) => [`${value}h`, '']}
                                    />
                                    <Legend />
                                    {tiposUnicos.map(tipo => (
                                        <Line
                                            key={tipo}
                                            type="monotone"
                                            dataKey={tipo}
                                            stroke={CORES_TIPOS[tipo] || '#8884d8'}
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Estatisticas;