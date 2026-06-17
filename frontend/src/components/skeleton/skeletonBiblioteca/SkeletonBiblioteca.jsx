import Skeleton from '../Skeleton';
import styles from './SkeletonBiblioteca.module.css';

function SkeletonBiblioteca() {
    return (
        <div className={styles.container}>
            {/* Título e subtítulo */}
            <Skeleton largura="40%" altura="32px" />
            <Skeleton largura="60%" altura="20px" />

            {/* Filtros de nível */}
            <div className={styles.filtros}>
                {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} largura="70px" altura="36px" />
                ))}
            </div>

            {/* Filtros de tipo */}
            <div className={styles.filtros}>
                {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} largura="90px" altura="36px" />
                ))}
            </div>

            {/* Carrosseis */}
            <div className={styles.carrosseis}>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className={styles.carrossel}>
                        <Skeleton largura="80px" altura="24px" />
                        <div className={styles.cards}>
                            <Skeleton largura="200px" altura="120px" />
                            <Skeleton largura="200px" altura="120px" />
                            <Skeleton largura="200px" altura="120px" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SkeletonBiblioteca;