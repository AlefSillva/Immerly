import classNames from 'classnames';
import { usePagination } from '../../hooks/usePagination';
import styles from './Paginacao.module.css';

function Paginacao(props) {
    const {
        onPageChange,
        contagemTotal,
        tamanhoPagina,
        paginaAtual,
        className
    } = props;

    const rangePaginacao = usePagination({
        paginaAtual,
        contagemTotal,
        tamanhoPagina
    });

    if (paginaAtual === 0 || rangePaginacao.length < 2) {
        return null
    }

    const onNext = () => {
        onPageChange(paginaAtual + 1)
    }

    const onPrevious = () => {
        onPageChange(paginaAtual - 1)
    }

    let ultimaPagina = rangePaginacao[rangePaginacao.length - 1];

    return (
        <nav className={classNames(styles.paginacaoContainer, className)}>
            <button
                className={classNames(styles.seta, {
                    [styles.desativado]: paginaAtual === 1
                })}
                onClick={onPrevious}
                disabled={paginaAtual === 1}
            >
                &#60;
            </button>

            <ul className={styles.listaBolinhas}>
                {rangePaginacao.map((numeroPagina) => (
                    <li
                        key={numeroPagina}
                        className={classNames(styles.bolinha, {
                            [styles.selecionada]: numeroPagina === paginaAtual
                        })}
                        onClick={() => onPageChange(numeroPagina)}
                    />
                ))}
            </ul>

            <button
                className={classNames(styles.seta, {
                    [styles.desativado]: paginaAtual === ultimaPagina
                })}
                onClick={onNext}
                disabled={paginaAtual === ultimaPagina}
            >
                &#62;
            </button>
        </nav>
    );
}

export default Paginacao;
