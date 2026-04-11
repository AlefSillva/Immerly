import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './Register.module.css';

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ nome: '', email: '', senha: '' });
    const [erro, setErro] = useState('');

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        try {
            await api.post('auth/register', form);
            navigate('/login');
        
        } catch (err) {
            setErro(err.response?.data?.message || 'Erro ao criar conta.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.titulo}>Immerly</h1>
                <p className={styles.subtitulo}>Crie sua conta e comece a trackear sua imersão</p>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.grupo}>
                        <label className={styles.label}>Nome</label>
                        <input
                            className={styles.input}
                            type="text"
                            name='nome'
                            value={form.nome}
                            onchange={handleChange}
                            placeholder='Seu nome'
                            required
                        />
                    </div>

                    <div className={styles.grupo}>
                        <label className={styles.label}>Email</label>
                        <input
                            className={styles.input}
                            type="email"
                            name='email'
                            value={form.email}
                            onChange={handleChange}
                            placeholder='seu@email.com'
                            required
                        />
                    </div>

                    <div className={styles.grupo}>
                        <label className={styles.label}>Senha</label>
                        <input
                            className={styles.input}
                            type="password"
                            name='senha'
                            value={form.senha}
                            onChange={handleChange}
                            placeholder='Sua senha'
                            required
                        />
                    </div>

                    {erro && <p className={styles.erro}>{erro} </p>}
                    
                    <button className={styles.botao} type='submit'>
                        Criar conta
                    </button>
                </form>

                <p className={styles.Link}>
                    Já tem uma conta? <Link to='/login'>Entrar</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;