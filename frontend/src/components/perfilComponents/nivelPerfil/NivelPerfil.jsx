import styles from './NivelPerfil.module.css';

const NIVEIS = [
    { min: 0, max: 50, nivel: 'A1', descricao: 'Iniciante', cor: '#4caf50' },
    { min: 51, max: 150, nivel: 'A2', descricao: 'Básico', cor: '#2196f3' },
    { min: 151, max: 400, nivel: 'B1', descricao: 'Intermediário', cor: '#ff9800' },
    { min: 401, max: 800, nivel: 'B2', descricao: 'Intermediário avançado', cor: '#e91e63' },
    { min: 801, max: Infinity, nivel: 'C1', descricao: 'Avançado', cor: '#9c27b0' },
];

function NivelPerfil({ totalHoras }) {
    const nivelAtual = NIVEIS.find(n => totalHoras <= n.max) || NIVEIS[NIVEIS.length - 1];
    const proximoNivel = NIVEIS[NIVEIS.indexOf(nivelAtual) + 1];
    const porcentagem = proximoNivel
        ? Math.min(((totalHoras - nivelAtual.min) / (proximoNivel.min - nivelAtual.min)) * 100, 100)
        : 100;

    return (
        <div className={styles.container}>
            <div className={styles.topo}>
                <div className={styles.info}>
                    <span className={styles.descricao}>{nivelAtual.descricao}</span>
                </div>
                <span className={styles.nivel} style={{ color: nivelAtual.cor }}>
                    {nivelAtual.nivel}
                </span>
            </div>

            <div className={styles.barra}>
                <div
                    className={styles.preenchimento}
                    style={{ width: `${porcentagem}%`, backgroundColor: nivelAtual.cor }}
                />
            </div>

            <div className={styles.rodape}>
                {proximoNivel ? (
                    <span className={styles.progresso}>
                        Faltam <strong>{(proximoNivel.min - totalHoras).toFixed(1)}h</strong> para {proximoNivel.nivel}
                    </span>
                ) : (
                    <span className={styles.maximo}>🏆 Nível máximo atingido!</span>
                )}
                <span className={styles.porcentagem}>{porcentagem.toFixed(0)}%</span>
            </div>
        </div>
    );
}

export default NivelPerfil;