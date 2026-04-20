import CardRecurso from "../cards/cardRecurso/CardRecurso";
import styles from './Carrossel.module.css'

function Carrossel({ titulo, recursos }) {
    if (!recursos || recursos.lengh === 0) return null;

    return (
        <div className={ styles.secao }>
            <h2 className={ styles.titulo }>{ titulo }</h2>

            <div className={styles.faixa}>
                {recursos.map((recuurso) => (
                    <CardRecurso
                        key={recuurso.id}
                        nome={recursos.nome}
                        tipo={recursos.tipo}
                        nivel={recursos.nivel}
                        descricao={recursos.descricao}
                        link_externo={recursos.link_externo}
                    />
                ))}
            </div>
        </div>
    );
}

export default Carrossel;