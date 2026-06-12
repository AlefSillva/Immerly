import { useState, useEffect } from 'react';
import api from '../services/api';

const CORES_TIPOS = {
    filme: '#6c63ff',
    serie: '#FF521B',
    podcast: '#4caf50',
    video: '#2196f3',
    livro: '#ff9800',
    musica: '#e91e63',
    artigo: '#00BCD4',
};

function useEstatisticas(adicionarToast) {
    const [sessoes, setSessoes] = useState([]);
    const [porMes, setPorMes] = useState([]);
    const [porTipoMes, setPorTipoMes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const buscarDados = async () => {
            try {
                const [resSessoes, resPorMes, resPorTipoMes] = await Promise.all([
                    api.get('/sessoes'),
                    api.get('/metricas/horas-por-mes'),
                    api.get('/metricas/horas-por-tipo-mes'),
                ]);
                setSessoes(resSessoes.data.sessoes);
                setPorMes(resPorMes.data.por_mes);
                setPorTipoMes(resPorTipoMes.data.por_tipo_mes);
            } catch (err) {
                adicionarToast(err.response?.data?.message || 'Erro ao carregar dados.', 'erro');
            } finally {
                setCarregando(false);
            }
        };
        buscarDados();
    }, [adicionarToast]);

    // Total de sessões
    const totalSessoes = sessoes.length;

    // Tipo favorito
    const tipoFavorito = () => {
        if (!sessoes.length) return '-';
        const contagem = {};
        sessoes.forEach(s => {
            contagem[s.tipo] = (contagem[s.tipo] || 0) + 1;
        });
        return Object.entries(contagem).sort((a, b) => b[1] - a[1])[0][0];
    };

    // Melhor dia da semana
    const melhorDia = () => {
        if (!sessoes.length) return '-';
        const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const contagem = {};
        sessoes.forEach(s => {
            const dia = new Date(s.data).getDay();
            contagem[dia] = (contagem[dia] || 0) + s.duracao_minutos;
        });
        const melhor = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0][0];
        return dias[melhor];
    };

    // Conteúdo mais longo
    const conteudoMaisLongo = () => {
        if (!sessoes.length) return '-';
        return sessoes.reduce((max, s) => s.duracao_minutos > max.duracao_minutos ? s : max).nome_conteudo;
    };

    // Dados formatados pro gráfico de barras mensal
    const dadosPorMes = porMes.map(item => ({
        mes: item.mes,
        horas: parseFloat(item.horas),
    }));

    // Dados formatados pro gráfico de linha
    const tiposUnicos = [...new Set(porTipoMes.map(item => item.tipo))];
    const mesesUnicos = [...new Set(porTipoMes.map(item => item.mes))];
    const dadosPorTipoMes = mesesUnicos.map(mes => {
        const ponto = { mes };
        tiposUnicos.forEach(tipo => {
            const encontrado = porTipoMes.find(item => item.mes === mes && item.tipo === tipo);
            ponto[tipo] = encontrado ? parseFloat(encontrado.horas) : 0;
        });
        return ponto;
    });

    // Média de compreensão por tipo
    const mediaCompreensaoPorTipo = () => {
        if (!sessoes.length) return [];
        const agrupado = {};
        sessoes.forEach(s => {
            if (!agrupado[s.tipo]) agrupado[s.tipo] = { total: 0, count: 0 };
            agrupado[s.tipo].total += Number(s.grau_compreensao);
            agrupado[s.tipo].count += 1;
        });
        return Object.entries(agrupado).map(([tipo, dados]) => ({
            tipo,
            media: parseFloat((dados.total / dados.count).toFixed(1)),
        })).sort((a, b) => b.media - a.media);
    };

    return {
        carregando,
        totalSessoes,
        tipoFavorito: tipoFavorito(),
        melhorDia: melhorDia(),
        conteudoMaisLongo: conteudoMaisLongo(),
        dadosPorMes,
        dadosPorTipoMes,
        tiposUnicos,
        dadosCompreensao: mediaCompreensaoPorTipo(),
        CORES_TIPOS,
    };
}

export default useEstatisticas;