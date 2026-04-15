import styles from './CampoMinutos.module.css';

function CampoMinutos({ label, name, value, onChange, required }) { 
    return (
        <div className={styles.grupo}>
            <label className={ styles.label }>{ label }</label>
            <input 
                className={ styles.input }
                type="number" 
                name={ name } 
                value={ value } 
                onChange={onChange} 
                min="1"
                max="600"
                placeholder='ex: 30'
                required={ required }
            /><span className={ styles.sufixo }>min</span>
        </div>
    );
}

export default CampoMinutos;