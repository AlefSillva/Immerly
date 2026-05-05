import styles from "./CampoMeta.module.css";

function CampoMeta({ label, nome, tipo, valor, onChange, min, placeholder, required = false }) {
    return (
        <div className={styles.card}>
            <label className={styles.label}>{label}</label>
            <input
                className={styles.input}
                type={tipo}
                name={nome}
                value={valor}
                onChange={onChange}
                min={min}
                placeholder={placeholder}
                required={ required}
            />
        </div>
    );
}

export default CampoMeta;
