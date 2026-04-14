import styles from './Botao.module.css';

function Botao({ texto, type = 'button', onClick }) {
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

export default Botao;