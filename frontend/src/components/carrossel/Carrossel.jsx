import CardRecurso from "../cards/cardRecurso/CardRecurso";
import styles from './Carrossel.module.css'

function Carrossel({ titulo, recursos }) {
    if (!recursos || recursos.lengh === 0) return null;

    return (
        <div className={ styles.secao }>
            <h2 className={ styles.titulo }>{ titulo }</h2>

            <div className={styles.faixa}>
                {recursos.map((recurso) => (
                    <CardRecurso
                        key={recurso.id}
                        nome={recurso.nome}
                        tipo={recurso.tipo}
                        nivel={recurso.nivel}
                        descricao={recurso.descricao}
                        link_externo={recurso.link_externo}
                    />
                ))}
            </div>
        </div>
    );
}

export default Carrossel;