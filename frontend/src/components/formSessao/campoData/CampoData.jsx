import styles from './CampoData.module.css';

function CampoData({ label, name, value, onChange }) { 
    return (
        <div className={ styles.grupo }>
            <label className={ styles.label }>{ label }</label>
            <input 
                className={ styles.select }
                type="date" 
                name={ name } 
                value={ value } 
                onChange={onChange} 
                required
            />
        </div>
    );
}

export default CampoData;