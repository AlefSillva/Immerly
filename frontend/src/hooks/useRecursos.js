import { useState, useEffect } from 'react';
import api from '../services/api';

const useRecursos = () => {
    const [recursos, setRecursos] = useState([]);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const buscarRecursos = async () => {
            try {
                const resposta = await api.get('/recursos');
                setRecursos(resposta.data.recursos);
            } catch (err) {
                setErro(err.response?.data?.message || 'Erro ao carregar recursos.');
            } finally {
                setCarregando(false);
            }
        };

        buscarRecursos();
    }, []);

    return { recursos, erro, carregando };
};

export default useRecursos;