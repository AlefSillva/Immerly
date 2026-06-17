import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useMetas = () => {
    const [metricas, setMetricas] = useState(null);
    const [meta, setMeta] = useState({ meta_semanal: 0, meta_mensal: 0 });
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const buscarDados = useCallback(async () => {
        try {
            const [resMetricas, resMeta] = await Promise.all([
                api.get('/metricas'),
                api.get('/metas')
            ]);
            setMetricas(resMetricas.data);
            if (resMeta.data.meta) {
                setMeta(resMeta.data.meta);
            }
        } catch (err) {
            setErro(err.response?.data?.message || 'Erro ao carregar metas.');
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        buscarDados();
    }, [buscarDados]);

    return { metricas, meta, carregando, erro, buscarDados };
};

export default useMetas;