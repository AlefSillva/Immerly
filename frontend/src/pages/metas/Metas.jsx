import useMetas from '../../hooks/useMetas';
import FormMetas from '../../components/formMetas/FormMetas';
import ProgressoMeta from '../../components/progressoMeta/ProgressoMeta'
import styles from './Metas.module.css';

function Metas() {
    const { metricas, meta, buscarDados } = useMetas();
    
    return (
        <div className={styles.container}>
            <h1 className={styles.titulo}>Metas</h1>
            <p className={styles.subtitulo}>Defina e acompanhe suas metas de imersão</p>
            
            <div className={styles.conteudo}>
                {/* Cards sempre visíveis — mostram 0h se meta não definida */}
                <div className={styles.progresso}>
                    <ProgressoMeta
                        label="Meta Semanal"
                        atual={metricas?.media_semanal_horas ?? 0}
                        meta={parseFloat(meta.meta_semanal) || 0}
                        cor="#6c63ff"
                    />
                    <ProgressoMeta
                        label="Meta Mensal"
                        atual={metricas?.media_mensal_horas ?? 0}
                        meta={parseFloat(meta.meta_mensal) || 0}
                        cor="#6c63ff"
                    />
                </div>
                {/* onSucesso rebusca os dados após salvar a meta */}
                <FormMetas onSucesso={buscarDados} />
            </div>
        </div>
    )
}

export default Metas;