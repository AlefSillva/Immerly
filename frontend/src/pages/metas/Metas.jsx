import FormMetas from '../../components/formMetas/FormMetas';
import styles from './Metas.module.css';

function Metas() {
    return (
        <div className={ styles.container }>
            <h1 className={styles.titulo}>Metas</h1>
            <p className={styles.subtitulo}>Defina suas metas de imersão semanal e mensal</p>

            <FormMetas />
        </div>
    )
}

export default Metas;