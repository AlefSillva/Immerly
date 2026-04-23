import styles from './CardRecurso.module.css';

const CORES_NIVEL = {
    A1: '#4caf50',
    A2: '#2196f3',
    B1: '#ff9800',
    B2: '#e91e63',
    C1: '#9c27b0',
}

function CardRecurso({ nome, tipo, nivel, descricao, link_externo }) {
    const corNivel = CORES_NIVEL[nivel] || '#6c63ff';

    return (
        <div className={ styles.card }>
            <div className={ styles.topo }>
                <span className={styles.tipo}>{tipo}</span>
                {nivel &&
                    <span
                        className={styles.nivel}
                        style={{ backgroundColor: corNivel }}
                    >
                        {nivel}
                    </span>}
            </div>

            <h3 className={styles.nome}>{nome}</h3>
            
            {descricao && (
                <p className={ styles.descricao }>{ descricao }</p>
            )}

            <a
                className={ styles.link }
                href={link_externo}
                target="_blank"
                rel="noopener noreferrer"
            >
                Acessar recurso →
            </a>
        </div>
    );
}

export default CardRecurso;