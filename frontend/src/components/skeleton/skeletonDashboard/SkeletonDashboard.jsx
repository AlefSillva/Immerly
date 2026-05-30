import Skeleton from '../Skeleton';
import styles from './SkeletonDashboard.module.css';

function SkeletonDashboard() {
    return (
        <div className={styles.container}>
            {/* Mensagem motivacional */}
            <Skeleton largura="60%" altura="24px" />

            {/* Card de nível */}
            <Skeleton largura="100%" altura="100px" />

            {/* Grid de métricas */}
            <div className={styles.grid}>
                <Skeleton largura="100%" altura="80px" />
                <Skeleton largura="100%" altura="80px" />
                <Skeleton largura="100%" altura="80px" />
                <Skeleton largura="100%" altura="80px" />
                <Skeleton largura="100%" altura="80px" />
            </div>

            {/* Gráficos */}
            <div className={styles.graficos}>
                <Skeleton largura="100%" altura="300px" />
                <Skeleton largura="100%" altura="300px" />
            </div>

            {/* Calendário */}
            <Skeleton largura="100%" altura="150px" />
        </div>
    );
}

export default SkeletonDashboard;