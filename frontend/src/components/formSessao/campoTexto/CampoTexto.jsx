import styles from './CampoTexto.module.css';

function CampoTexto({ label, name, value, onChange, placeholder, required }) {
    return (
        <div className={ styles.grupo }>
            <label className={styles.label}>{label}</label>
            <input
                className={ styles.input }
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={ required }
            />
        </div>
    );
}

export default CampoTexto;