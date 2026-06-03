import styles from './Toast.module.css';

function Toast({ toasts }) {
    if (!toasts || toasts.length === 0) return null;

    return (
        <div className={styles.wrapper}>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${styles.toast} ${styles[toast.tipo]}`}
                >
                    {toast.tipo === 'sucesso' ? '✅' : '❌'} {toast.mensagem}
                </div>
            ))}
        </div>
    );
}

export default Toast;