import { useState, useEffect } from 'react'
import api from '../../services/api'
import CardMetrica from '../../components/cardMetrica/CardMetrica'
import styles from './Dashboard.module.css';


function Dashboard() {
    const [metricas, setMetricas] = useState(null);
    const [erro, setErro] = useState('');

    useEffect(() => {
        const buscarMetricas = async () => {
            try {
                const resposta = await api.get('/metricas');
                setMetricas(resposta.data);
            } catch (err) {
                setErro( err.response?.data?.message ||  'Erro ao carregar métricas' );
            }
        };

        buscarMetricas();
    },  []);

    return (
        <div className={styles.container}>
            <h1 className={styles.titulo}>Dashboard</h1>
            <p className={styles.subtitulo}>Acompanhe sua imersão</p>
            
            {erro && <p className={styles.erro}>{erro}</p>}
            
            {metricas ? (
                <>
                    <p className={styles.mensagem}>{metricas.mensagem}</p>
                    
                    <div className={styles.grid}>
                        <CardMetrica
                            titulo=""
                            valor={(metricas.total_horas ?? 0).toFixed(1)}
                            sufixo="h"
                        />
                        <CardMetrica
                            titulo=""
                            valor={(metricas.media_semanal ?? 0).toFixed(1)}
                            sufixo="h"
                        />
                        <CardMetrica
                            titulo=""
                            valor={(metricas.media_mensal ?? 0).toFixed(1)}
                            sufixo="h"
                        />
                        <CardMetrica
                            titulo=""
                            valor={metricas.streak}
                            sufixo="dias"
                        />
                        <CardMetrica
                            titulo=""
                            valor={(metricas.projecao_4_semanas ?? 0).toFixed(1)}
                            sufixo="h"
                        />
                    </div>
                </>
            ) : (
                    !erro && <p className={styles.carregando}>Carregando...
                    </p>
            )}
        </div>
    );
}

export default Dashboard;