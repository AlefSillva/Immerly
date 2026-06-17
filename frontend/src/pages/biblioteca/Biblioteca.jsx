import { useState } from 'react';
import useRecursos from '../../hooks/useRecursos';
import Carrossel from '../../components/carrossel/Carrossel';
import SkeletonBiblioteca from '../../components/skeleton/skeletonBiblioteca/SkeletonBiblioteca';
import styles from './Biblioteca.module.css'


const NIVEIS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const TIPOS = ['listening', 'speaking', 'reading', 'writing', 'grammar', 'vocabulary', 'reference'];

function Biblioteca() {
    const { recursos, erro, carregando } = useRecursos();
    const [nivelAtivo, setNivelAtivo] = useState('Todos');
    const [tipoAtivo, setTipoAtivo] = useState('Todos');

    if (carregando) return <SkeletonBiblioteca />;

    const handleNivel = (nivel) => {
        if (nivel === nivelAtivo) {
            setNivelAtivo('Todos');
        } else {
            setNivelAtivo(nivel);
        }
    };
    
    const handleTipo = (tipo) => { 
        if (tipo === tipoAtivo) { 
            setTipoAtivo('Todos');
        } else {
            setTipoAtivo(tipo);
        }
    }


    // Filtra recursos por nível
    const porNivel = (nivel) => { 
        const doNivel = recursos.filter((r) => r.nivel === nivel);
        if (tipoAtivo === 'Todos') return doNivel;
        return doNivel.filter((r) => r.tipo === tipoAtivo);
    }

    // Filtro de ferramentas por tipo
    const ferramentas = () => {
        const semNivel = recursos.filter((r) => !r.nivel);
        if (tipoAtivo === 'Todos') return semNivel;
        return semNivel.filter((r) => r.tipo === tipoAtivo);
    };

    // Define quais niveis mostrar baseado no filtro ativo
    const niveisExibidos = nivelAtivo === 'Todos'
        ? NIVEIS
        : nivelAtivo === 'Ferramentas'
            ? []
            : [nivelAtivo];
    
    const mostrarFerramentas = nivelAtivo === 'Todos' || nivelAtivo === 'Ferramentas';

    return ( 
        <div className={styles.container}>
            <h1 className={styles.titulo}>Biblioteca</h1>
            <p className={styles.subtitulo}>Recursos para ajudar na sua imersão</p>

            {erro && <p className={styles.erro}>{erro}</p>}

            { /* Filtro por nível */}
            <div className={styles.filtros}>
                <p className={ styles.filtroLabel }>Nível:</p>
                <div className={styles.botoesFiltro}>
                    {[ 'Todos', ...NIVEIS, 'Ferramentas' ].map((nivel) => (
                        <button
                            key={nivel}
                            className={`${styles.botaoFiltro} ${nivelAtivo === nivel ? styles.ativo : ''}`}
                            onClick={() => handleNivel(nivel)}
                        >
                            {nivel}
                        </button>
                    ))}
                </div>
            </div>

            { /* Filtro por tipo */}
            <div className={styles.filtros}>
                <p className={ styles.filtroLabel}>Tipo:</p>
                <div className={styles.botoesFiltro}>
                    {['Todos', ...TIPOS].map((tipo) => (
                        <button
                            key={tipo}
                            onClick={() => handleTipo(tipo)}
                            className={`${styles.botaoFiltro} ${tipoAtivo === tipo ? styles.ativo : ''}`}
                        >
                            { tipo }
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.secoes}>
                {niveisExibidos.map((nivel) => (
                    <Carrossel
                        key={nivel}
                        titulo={nivel}
                        recursos={porNivel(nivel)}
                    />
                ))}

                {mostrarFerramentas && (
                    <Carrossel
                        titulo="Ferramentas"
                        recursos={ferramentas()}
                    />
                )}
            </div>
        </div>    
    );
}

export default Biblioteca;