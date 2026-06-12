import CardEstatistica from '../../components/cards/cardEstatistica/CardEstatistica';
import { useToastContext } from '../../contexts/ToastContext';
import SkeletonEstatisticas from '../../components/skeleton/skeletonEstatisticas/SkeletonEstatisticas';
import useEstatisticas from '../../hooks/useEstatisticas';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, Cell
} from 'recharts';
import styles from './Estatisticas.module.css';

function Estatisticas() {
    const { adicionarToast } = useToastContext();
    const {
        carregando,
        totalSessoes,
        tipoFavorito,
        melhorDia,
        conteudoMaisLongo,
        dadosPorMes,
        dadosPorTipoMes,
        tiposUnicos,
        dadosCompreensao,
        CORES_TIPOS,
    } = useEstatisticas(adicionarToast);

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
                        <CardEstatistica valor={tipoFavorito} label="Tipo favorito" />
                        <CardEstatistica valor={melhorDia} label="Melhor dia da semana" />
                        <CardEstatistica valor={conteudoMaisLongo} label="Conteúdo mais longo" />
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

                    {dadosCompreensao.length > 0 && (
                        <div className={styles.grafico}>
                            <h2 className={styles.tituloGrafico}>Média de compreensão por tipo</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={dadosCompreensao} layout="vertical">
                                    <XAxis type="number" domain={[0, 5]} stroke="#a0a0a0" />
                                    <YAxis type="category" dataKey="tipo" stroke="#a0a0a0" width={60} />
                                    <Tooltip
                                        contentStyle={estiloTooltip}
                                        labelStyle={estiloLabel}
                                        itemStyle={estiloLabel}
                                        formatter={(value) => [`${value}/5`, 'Média de compreensão']}
                                    />
                                    <Bar dataKey="media" radius={[0, 4, 4, 0]}>
                                        {dadosCompreensao.map((entry) => (
                                            <Cell
                                                key={entry.tipo}
                                                fill={CORES_TIPOS[entry.tipo] || '#8884d8'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Estatisticas;