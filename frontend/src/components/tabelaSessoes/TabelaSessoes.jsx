import styles from './TabelaSessoes.module.css';

// Mapeia o grau de compreensão numérico para texto legível
const grauLabel = (grau) => {
    const labels = {
        1: 'Pouco (0-25%)',
        2: 'Metade (26-50%)',
        3: 'A maioria (51-75%)',
        4: 'Quase tudo (76-90%)',
        5: 'Tudo (91-100%)',
    };
    return labels[Number(grau)] || '-';
}

// Formata a data de ISO para DD/MM/YYYY
const formatarData = (data) => {
    if (!data) return '-';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
};

function TabelaSessoes({ sessoes }) {
    if (!sessoes || sessoes.length === 0) {
        return <p className={styles.semDados}>Nenhuma sessão registrada.</p>;
    }

    return (
        <div className={styles.wrapper}>
            <table className={styles.tabela}>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Conteúdo</th>
                        <th>Tipo</th>
                        <th>Duração</th>
                        <th>Nível</th>
                        <th>Compreensão</th>
                    </tr>
                </thead>
                <tbody>
                    {sessoes.map((sessao) => (
                        <tr key={sessao.id}>
                            <td>{formatarData(sessao.data)}</td>
                            <td>{sessao.nome_conteudo}</td>
                            <td>{sessao.tipo}</td>
                            <td>{sessao.duracao_minutos}</td>
                            <td>{sessao.nivel_estimado}</td>
                            <td>{grauLabel(sessao.grau_compreensao)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );   
}

export default TabelaSessoes;