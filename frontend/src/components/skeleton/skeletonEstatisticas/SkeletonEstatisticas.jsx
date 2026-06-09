import Skeleton from '../Skeleton';
import styles from './SkeletonEstatisticas.module.css';

function SkeletonEstatisticas() {
    return (
        <div className={styles.container}>
            {/* Cards de resumo */}
            <div className={styles.cards}>
                <Skeleton largura="100%" altura="100px" />
                <Skeleton largura="100%" altura="100px" />
                <Skeleton largura="100%" altura="100px" />
                <Skeleton largura="100%" altura="100px" />
            </div>

            {/* Gráficos */}
            <Skeleton largura="100%" altura="300px" />
            <Skeleton largura="100%" altura="300px" />
            <Skeleton largura="100%" altura="300px" />
        </div>
    );
}

export default SkeletonEstatisticas;