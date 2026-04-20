import styles from './CardRecurso.module.css';

function CardRecurso({ nome, tipo, nivel, descricao, link_externo }) {
    return (
        <div className={ styles.card }>
            <div className={ styles.topo }>
                <span className={styles.tipo}>{tipo}</span>
                {nivel && <span className={ styles.nivel }>{ nivel }</span> }
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