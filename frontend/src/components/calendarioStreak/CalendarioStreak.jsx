import styles from './CalendarioStreak.module.css';

function CalendarioStreak({ porDia }) {
    // Gera os últimos 30 dias
    const hoje = new Date();
    const dias = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(hoje);
        d.setDate(hoje.getDate() - (29 - i));
        return d;
    });

    // Cria um Set com as datas que têm sessão registrada
    const datasComSessao = new Set(
        (porDia || []).map(item => {
            const d = new Date(item.dia);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })
    );

    const temSessao = (data) => {
        const key = `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}`;
        return datasComSessao.has(key);
    };

    const formatarTooltip = (data) => {
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.titulo}>Atividade nos últimos 30 dias</h2>
            <div className={styles.grid}>
                {dias.map((dia, idx) => (
                    <div
                        key={idx}
                        className={`${styles.dia} ${temSessao(dia) ? styles.ativo : styles.inativo}`}
                        title={formatarTooltip(dia)}
                    />
                ))}
            </div>
            <div className={styles.legenda}>
                <div className={styles.legendaItem}>
                    <div className={`${styles.dia} ${styles.inativo}`} />
                    <span>Sem sessão</span>
                </div>
                <div className={styles.legendaItem}>
                    <div className={`${styles.dia} ${styles.ativo}`} />
                    <span>Com sessão</span>
                </div>
            </div>
        </div>
    );
}

export default CalendarioStreak;