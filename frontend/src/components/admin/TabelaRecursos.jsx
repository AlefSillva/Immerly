import styles from './TabelaRecursos.module.css';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

// Recebe a lista de recursos e as funções de editar/deletar do Admin.jsx via props
function TabelaRecursos({ recursos, onEditar, onDeletar }) {
    return (
        <div className={styles.wrapper}>
            <table className={styles.tabela}>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Nível</th>
                        <th>Descrição</th>
                        <th>Link</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {recursos.map(recurso => (
                        <tr key={recurso.id}>
                            <td>{recurso.nome}</td>
                            <td>{recurso.tipo}</td>
                            <td>{recurso.nivel || 'Ferramenta'}</td>
                            <td>{recurso.descricao}</td>
                            <td>
                                <a href={recurso.link_externo} target="_blank" rel="noreferrer">
                                    Ver
                                </a>
                            </td>
                            <td>
                                <div className={styles.acoes}>
                                    <button
                                        onClick={() => onEditar(recurso)}
                                        className={styles.botaoEditar}
                                    >
                                        <FiEdit2 />
                                    </button>
                                    <button
                                        onClick={() => onDeletar(recurso.id)}
                                        className={styles.botaoDeletar}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TabelaRecursos;