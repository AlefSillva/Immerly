import { useState, useEffect } from 'react';
import api from '../../services/api'
import FormMetas from '../../components/formMetas/FormMetas';
import ProgressoMeta from '../../components/progressoMeta/ProgressoMeta'
import styles from './Metas.module.css';

function Metas() {
    const [metricas, setMetricas] = useState(null);
    const [meta, setMeta ] =useState(null)

    useEffect(() => {
        const buscarDados = async () => {
            try {
                const [resMetricas, resMeta] = await Promise.all([
                    api.get('/metricas'),
                    api.get('/metas')
                ]);
                setMetricas(resMetricas.data);
                setMeta(resMeta.data.meta);
            } catch (err) {
                err.response?.data?.message || ""
            }
        };

        buscarDados();
    }, []);
    
    return (
        <div className={ styles.container }>
            <h1 className={styles.titulo}>Metas</h1>
            <p className={styles.subtitulo}>Defina e acompanhe suas metas de imersão</p>
            
            {metricas && meta && (
                <div className={ styles.progresso }>
                    <ProgressoMeta 
                        label = "Meta Semanal"
                        atual = { metricas.media_semanal_horas }
                        meta = { parseFloat(meta.meta_semanal) }
                        cor = "#6c63ff"
                    />
                    <ProgressoMeta 
                        label = "Meta Mensal"
                        atual = { metricas.media_mensal_horas }
                        meta = { parseFloat(meta.meta_mensal) }
                        cor = "#6c63ff"
                    />
                </div>
            )}

            <FormMetas />
        </div>
    )
}

export default Metas;