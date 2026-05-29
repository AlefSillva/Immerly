import { Link } from 'react-router-dom';
import styles from './NaoEncontrado.module.css';

function NaoEncontrado() {
    const token = localStorage.getItem('token');

    return (
        <div className={styles.container}>
            <h1 className={styles.codigo}>404</h1>
            <h2 className={styles.titulo}>Página não encontrada</h2>
            <p className={styles.descricao}>
                Parece que você se perdeu na imersão. Essa página não existe.
            </p>
            <Link 
                to={token ? '/dashboard' : '/landing'} 
                className={styles.botao}
            >
                Voltar ao início
            </Link>
        </div>
    );
}

export default NaoEncontrado;