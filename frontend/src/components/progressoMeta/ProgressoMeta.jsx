import styles from './ProgressoMeta.module.css';

function ProgressoMeta({ label, atual, meta, cor }) {
    const porcentagem = meta > 0 ? Math.min((atual / meta) * 100, 100) : 0;
    const atingiu = porcentagem >= 100;

    return (
        <div className={styles.container}>
            <div className={styles.topo}>
                <span className={styles.label}>{label}</span>
                <span className={styles.valores}>
                    {atual}h <span className={styles.separador}>/</span> {meta}h
                </span>
            </div>

            <div className={styles.barra}>
                <div
                    className={styles.preenchimento}
                    style={{
                        width: `${porcentagem}%`,
                        backgroundColor: atingiu ? '#4caf50' : cor
                    }}
                />
            </div>

            <div className={styles.rodape}>
                <span className={atingiu ? styles.atingiu : styles.faltam}>
                    {atingiu
                        ? '🎉 Meta atingida!'
                        : `Faltam ${(meta - atual).toFixed(1)}h`}
                </span>
                <span className={styles.porcentagem}>{porcentagem.toFixed(0)}%</span>
            </div>
        </div>
    );
}

export default ProgressoMeta;