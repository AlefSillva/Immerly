import styles from './BotaoMetas.module.css';

function BotaoMetas({ texto, type = 'button', onClick }) {
    return (
        <button
            className={styles.botao}
            type={type}
            onClick={onClick}
        >
            {texto}
        </button>
    );
}

export default BotaoMetas;