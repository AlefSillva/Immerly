import styles from './Skeleton.module.css';

function Skeleton({ largura = '100%', altura = '20px', borderRadius = '8px' }) {
    return (
        <div
            className={styles.skeleton}
            style={{ width: largura, height: altura, borderRadius }}
        />
    );
}

export default Skeleton;