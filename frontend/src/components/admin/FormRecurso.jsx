import styles from './FormRecurso.module.css';

// Opções de tipo e nível baseadas na tabela recursos
const TIPOS = ['listening', 'speaking', 'reading', 'writing', 'grammar', 'vocabulary', 'reference'];
const NIVEIS = ['A1', 'A2', 'B1', 'B2', 'C1'];

// Recebe o estado do formulário e as funções do Admin.jsx via props
function FormRecurso({ form, editandoId, onChange, onSubmit, onCancelar }) {
    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <h2 className={styles.subtitulo}>
                {editandoId ? 'Editar Recurso' : 'Novo Recurso'}
            </h2>

            <input
                className={styles.input}
                type="text"
                name="nome"
                placeholder="Nome"
                value={form.nome}
                onChange={onChange}
                required
            />

            <select
                className={styles.select}
                name="tipo"
                value={form.tipo}
                onChange={onChange}
                required
            >
                {TIPOS.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                ))}
            </select>

            <select
                className={styles.select}
                name="nivel"
                value={form.nivel}
                onChange={onChange}
            >
                <option value="">Sem nível (Ferramenta)</option>
                {NIVEIS.map(nivel => (
                    <option key={nivel} value={nivel}>{nivel}</option>
                ))}
            </select>

            <input
                className={styles.input}
                type="text"
                name="descricao"
                placeholder="Descrição"
                value={form.descricao}
                onChange={onChange}
                required
            />

            <input
                className={styles.input}
                type="url"
                name="link_externo"
                placeholder="Link externo (https://...)"
                value={form.link_externo}
                onChange={onChange}
                required
            />

            <div className={styles.botoesForm}>
                <button type="submit" className={styles.botaoSalvar}>
                    {editandoId ? 'Salvar Alterações' : 'Criar Recurso'}
                </button>
                {editandoId && (
                    <button
                        type="button"
                        onClick={onCancelar}
                        className={styles.botaoCancelar}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

export default FormRecurso;