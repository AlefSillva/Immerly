import styles from './CampoSelect.module.css';

function CampoSelect({ label, name, value, onChange, options }) { 
    return (
        <div className={ styles.grupo }>
            <label className={styles.label}>{label}</label>
            <select
                className={ styles.select }
                name={ name }
                value={ value }
                onChange={onChange}
                required
            >
                <option value="">Selecione uma opção</option>
                {options?.map((opcao) => (
                    <option key={ opcao.value } value={ opcao.value }>
                        { opcao.label }
                    </option>
                ))}
            </select>
        </div>
    );
}

export default CampoSelect;