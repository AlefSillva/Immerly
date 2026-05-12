import { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './Admin.module.css';
import FormRecurso from '../../components/admin/FormRecurso';
import TabelaRecursos from '../../components/admin/TabelaRecursos';

// Formulário vazio padrão
const FORM_VAZIO = { nome: '', tipo: 'listening', nivel: '', descricao: '', link_externo: '' };

function Admin() {
    const [recursos, setRecursos] = useState([]);
    const [form, setForm] = useState(FORM_VAZIO);
    const [editandoId, setEditandoId] = useState(null);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');
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
            setErro(err.response?.data?.message || 'Erro ao buscar recursos.');
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
        setMensagem('');
        setErro('');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Cancela a edição e limpa o formulário
    const handleCancelar = () => {
        setEditandoId(null);
        setForm(FORM_VAZIO);
        setMensagem('');
        setErro('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem('');
        setErro('');

        // Envia nivel como null se estiver vazio (ferramentas)
        const dados = { ...form, nivel: form.nivel || null };

        try {
            if (editandoId) {
                await api.put(`/admin/recursos/${editandoId}`, dados);
                setMensagem('Recurso atualizado com sucesso!');
            } else {
                await api.post('/admin/recursos', dados);
                setMensagem('Recurso criado com sucesso!');
            }

            setEditandoId(null);
            setForm(FORM_VAZIO);
            buscarRecursos();

            // Limpa mensagem após 3 segundos
            setTimeout(() => setMensagem(''), 3000);

        } catch (err) {
            setErro(err.response?.data?.message || 'Erro ao salvar recurso.');
        }
    };

    const handleDeletar = async (id) => {
        if (!window.confirm('Tem certeza que deseja deletar este recurso?')) return;

        try {
            await api.delete(`/admin/recursos/${id}`);
            setMensagem('Recurso deletado com sucesso!');
            buscarRecursos();
            setTimeout(() => setMensagem(''), 3000);
        } catch (err) {
            setErro(err.response?.data?.message || 'Erro ao deletar recurso.');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.titulo}>Painel Admin - Recursos</h1>

            <FormRecurso
                form={form}
                editandoId={editandoId}
                mensagem={mensagem}
                erro={erro}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancelar={handleCancelar}
            />

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