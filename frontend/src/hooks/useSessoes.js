import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToastContext } from '../contexts/ToastContext';

const useSessoes = () => {
    const { adicionarToast } = useToastContext();
    const [sessoes, setSessoes] = useState([]);
    const [filtroTipo, setFiltroTipo] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 5;

    const buscarSessoes = useCallback(async (page = paginaAtual, tipo = filtroTipo) => {
        try {
            const params = new URLSearchParams({ page, limit });
            if (tipo) params.append('tipo', tipo);
            const resposta = await api.get(`/sessoes?${params.toString()}`);
            setSessoes(resposta.data.sessoes);
            setTotalPaginas(resposta.data.paginacao.totalPaginas);
            setTotal(resposta.data.paginacao.total);
        } catch (err) {
            adicionarToast(err.response?.data?.message || 'Erro ao buscar sessões.', 'erro');
        }
    }, [paginaAtual, filtroTipo]);

    useEffect(() => {
        buscarSessoes(paginaAtual, filtroTipo);
    }, [paginaAtual, filtroTipo]);

    const editarSessao = async (id, dados) => {
        try {
            await api.put(`/sessoes/${id}`, dados);
            adicionarToast('Sessão atualizada com sucesso!', 'sucesso');
            buscarSessoes();
            return true;
        } catch (err) {
            adicionarToast(err.response?.data?.message || 'Erro ao atualizar sessão.', 'erro');
            return false;
        }
    };

    const deletarSessao = async (id) => {
        try {
            await api.delete(`/sessoes/${id}`);
            adicionarToast('Sessão deletada com sucesso!', 'sucesso');
            buscarSessoes();
            return true;
        } catch (err) {
            adicionarToast(err.response?.data?.message || 'Erro ao deletar sessão.', 'erro');
            return false;
        }
    };

    const handleFiltroTipo = (e) => {
        setFiltroTipo(e.target.value);
        setPaginaAtual(1);
    };

    return {
        sessoes,
        filtroTipo,
        paginaAtual,
        totalPaginas,
        total,
        buscarSessoes,
        editarSessao,
        deletarSessao,
        handleFiltroTipo,
        setPaginaAtual,
    };
};

export default useSessoes;