import styles from "./CardMetrica.module.css";

function CardMetrica({ titulo, valor, sufixo }) {
    return (
        <div className={ styles.card }>
            <span className={styles.titulo}>{ titulo }</span>
                
            <span className={styles.valor}>
                { valor }
                { sufixo && <span className={ styles.sufixo }>{ sufixo }</span>}
            </span>
        </div>
    )
}

export default CardMetrica;