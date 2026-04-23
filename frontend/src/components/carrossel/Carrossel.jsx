import { useState } from 'react';
import CardRecurso from "../cards/cardRecurso/CardRecurso";
import Paginacao from '../paginacao/Paginacao';
import styles from './Carrossel.module.css'

function Carrossel({ titulo, recursos }) {   
    const [paginaAtual, setPaginaAtual] = useState(1);

    const TAMANHO_PAG = 3;

    if (!recursos || recursos.length === 0) return null;

    const idx_inicial = (paginaAtual - 1) * TAMANHO_PAG;
    const idx_final = idx_inicial + TAMANHO_PAG;
    const recursosExibidos = recursos.slice(idx_inicial, idx_final);    

    return (
        <div className={ styles.secao }>
            <h2 className={ styles.titulo }>{ titulo }</h2>

            <div className={styles.faixa}>
                {recursosExibidos.map((recurso) => (
                    <CardRecurso
                        key={recurso.id}
                        nome={recurso.nome}
                        tipo={recurso.tipo}
                        nivel={recurso.nivel}
                        descricao={recurso.descricao}
                        link_externo={recurso.link_externo}
                    />
                ))}
            </div>

            <div className={styles.paginacao}>
                <Paginacao
                    paginaAtual={paginaAtual}
                    contagemTotal={recursos.length}
                    tamanhoPagina={TAMANHO_PAG}
                    onPageChange={(novaPagina) => setPaginaAtual(novaPagina)}
                />
            </div>
        </div>
    );
}

export default Carrossel;