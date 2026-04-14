import FormSessao from '../../components/formSessao/FormSessao';
import styles from './Sessoes.module.css';
    
function Sessoes() {
    return (
        <div className={ styles.container }>
            <h1 className={ styles.titulo }>Registrar Sessão</h1>
            <p className={ styles.subtitulo }>Registre sua sessão de imersão</p>
            <FormSessao />
        </div>
    );
}

export default Sessoes;