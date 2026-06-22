import { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './Admin.module.css';
import FormRecurso from '../../components/admin/FormRecurso';
import TabelaRecursos from '../../components/admin/TabelaRecursos';
import { useToastContext } from '../../contexts/ToastContext';

// Formulário vazio padrão
const FORM_VAZIO = { nome: '', tipo: 'listening', nivel: '', descricao: '', link_externo: '' };

function Admin() {
    const { adicionarToast } = useToastContext();
    const [recursos, setRecursos] = useState([]);
    const [form, setForm] = useState(FORM_VAZIO);
    const [editandoId, setEditandoId] = useState(null);
    const [carregando, setCarregando] = useState(true);

    // Busca todos os recursos ao carregar a página
    useEffect(() => {
        buscarRecursos();
    }, []);

    const buscarRecursos = async () => {
        try {
            const resposta = await api.get('/admin/recursos');
            setRecursos(resposta.data);
        } catch (err) {
            adicionarToast(err.response?.data?.message || 'Erro ao buscar recursos.', 'erro');
        } finally {
            setCarregando(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Preenche o formulário com os dados do recurso a ser editado
    const handleEditar = (recurso) => {
        setEditandoId(recurso.id);
        setForm({
            nome: recurso.nome,
            tipo: recurso.tipo,
            nivel: recurso.nivel || '',
            descricao: recurso.descricao,
            link_externo: recurso.link_externo
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Cancela a edição e limpa o formulário
    const handleCancelar = () => {
        setEditandoId(null);
        setForm(FORM_VAZIO);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Envia nivel como null se estiver vazio (ferramentas)
        const dados = { ...form, nivel: form.nivel || null };

        try {
            if (editandoId) {
                await api.put(`/admin/recursos/${editandoId}`, dados);
                adicionarToast('Recurso atualizado com sucesso!', 'sucesso');
            } else {
                await api.post('/admin/recursos', dados);
                adicionarToast('Recurso criado com sucesso!', 'sucesso');
            }

            setEditandoId(null);
            setForm(FORM_VAZIO);
            buscarRecursos();

        } catch (err) {
            adicionarToast(err.response?.data?.message || 'Erro ao salvar recurso.', 'erro');
        }
    };

    const handleDeletar = async (id) => {
        if (!window.confirm('Tem certeza que deseja deletar este recurso?')) return;

        try {
            await api.delete(`/admin/recursos/${id}`);
            adicionarToast('Recurso deletado com sucesso!', 'sucesso');
            buscarRecursos();
        } catch (err) {
            adicionarToast(err.response?.data?.message || 'Erro ao deletar recurso.', 'erro');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.titulo}>Painel Admin - Recursos</h1>

            <FormRecurso
                form={form}
                editandoId={editandoId}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancelar={handleCancelar}
            />

            // Exibe mensagem de carregamento ou a tabela de recursos
            {carregando ? (
                <p className={styles.carregando}>Carregando recursos...</p>
            ) : (
                <TabelaRecursos
                    recursos={recursos}
                    onEditar={handleEditar}
                    onDeletar={handleDeletar}
                />
            )}
        </div>
    );
}

export default Admin;