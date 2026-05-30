import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import api from '../../services/api';
import styles from './Register.module.css';
import NavbarPublica from '../../components/navbarPublica/NavbarPublica';

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
            const resposta = await api.post('/auth/register', form);
            localStorage.setItem('token', resposta.data.token);
            localStorage.setItem('usuario', JSON.stringify(resposta.data.usuario));
            navigate('/metas');
        
        } catch (err) {
            setErro(err.response?.data?.message || 'Erro ao criar conta.');
        }
    };

    const token = localStorage.getItem('token');
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <NavbarPublica />
            <div className={styles.container}>
            <div className={ styles.subcontainer }>
                <div className={styles.card}>
                    <h1 className={styles.titulo}>Registro</h1>
                    <p className={styles.subtitulo}>Crie sua conta e comece a trackear sua imersão</p>
                
                    <form onSubmit={handleSubmit}>
                        <div className={styles.grupo}>
                            <label className={styles.label}>Nome</label>
                            <input
                                className={styles.input}
                                type='text'
                                name='nome'
                                value={form.nome}
                                onChange={ handleChange }
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
                        { erro && <p className={ styles.erro }>{ erro }</p> }
                
                        <button className={ styles.botao } type='submit'>
                            Criar conta
                        </button>
                    </form>
                    <p className={ styles.link }>
                        Já tem uma conta? <Link to='/login'>Entrar</Link>
                    </p>
                </div>
            </div>
        </div>
        </>
    );
}

export default Register;