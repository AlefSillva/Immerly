import { useMemo } from "react";

export const usePagination = ({
    contagemTotal,
    tamanhoPagina,
}) => {
    const intervaloPaginacao = useMemo(() => {

        // Cálculo do total de páginas baseado nos recursos do banco
        const totalPaginas = Math.ceil(contagemTotal / tamanhoPagina);

        // Criam um array simples: [1, 2, 3, 4...] até o total de páginas
        // O length determina quantas bolinhas vão aparecer
        return Array.from({ length: totalPaginas }, (_, idx) => idx + 1);
        
    }, [contagemTotal, tamanhoPagina]);

    return intervaloPaginacao;
};