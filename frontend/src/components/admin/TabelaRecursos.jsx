import styles from './TabelaRecursos.module.css';

// Recebe a lista de recursos e as funções de editar/deletar do Admin.jsx via props
function TabelaRecursos({ recursos, onEditar, onDeletar }) {
    return (
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
                        <td className={styles.acoes}>
                            <button
                                onClick={() => onEditar(recurso)}
                                className={styles.botaoEditar}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => onDeletar(recurso.id)}
                                className={styles.botaoDeletar}
                            >
                                Deletar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default TabelaRecursos;