import styles from './MetricasPerfil.module.css';

function MetricasPerfil({ totalHoras, streakDias, mediaSemanal, projecao }) {
    const metricas = [
        { valor: `${totalHoras.toFixed(1)}h`, label: 'Total de horas' },
        { valor: `${streakDias} dias`, label: 'Streak atual' },
        { valor: `${mediaSemanal.toFixed(1)}h`, label: 'Média semanal' },
        { valor: `${projecao.toFixed(1)}h`, label: 'Projeção 4 semanas' },
    ];

    return (
        <div className={styles.grid}>
            {metricas.map((m, idx) => (
                <div key={idx} className={styles.item}>
                    <span className={styles.valor}>{m.valor}</span>
                    <span className={styles.label}>{m.label}</span>
                </div>
            ))}
        </div>
    );
}

export default MetricasPerfil;