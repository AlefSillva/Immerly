import styles from './CardEstatistica.module.css';

function CardEstatistica({ valor, label }) {
    return (
        <div className={styles.card}>
            <span className={styles.label}>{label}</span>
            <span className={styles.valor}>{valor}</span>
        </div>
    );
}

export default CardEstatistica;