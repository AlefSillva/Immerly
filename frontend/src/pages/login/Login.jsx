import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import api from '../../services/api'
import NavbarPublica from '../../components/navbarPublica/NavbarPublica';
import { useToastContext } from '../../contexts/ToastContext';
import styles from './Login.module.css'

function Login() {
    // Hook para exibir mensagens de toast
    const { adicionarToast } = useToastContext();
    // Hook para navegação programática
    const navigate = useNavigate();

    // Estado para armazenar os dados do formulário de login e mensagens de erro
    const [ form, setForm ] = useState({ email: '', senha: '' });
    
    // Função para lidar com mudanças nos campos do formulário
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Função para lidar com o envio do formulário de login
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const resposta = await api.post('/auth/login', form);
            localStorage.setItem('token', resposta.data.token);
            // Armazenar token e informações do usuário no localStorage 
            localStorage.setItem('usuario', JSON.stringify(resposta.data.usuario));
            navigate('/dashboard');

        } catch (err) {
            adicionarToast(err.response?.data?.message || 'Email ou senha incorretos.', 'erro');
        }
    };

    const token = localStorage.getItem('token');
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <NavbarPublica />
            <div className={ styles.container }>
                <div className={ styles.subcontainer }>
                    <div className={ styles.card }>
                        <h1 className={ styles.titulo }>Entrar</h1>
                        <p className={styles.subtitulo}>Bem-vindo(a) de volta</p>
                    
                        <form onSubmit={handleSubmit}>
                            <div className={ styles.grupo }>
                                <label className={ styles.label }>Email</label>
                                <input
                                    className={ styles.input }
                                    type="email"
                                    name="email"
                                    value={ form.email }
                                    onChange={ handleChange }
                                    placeholder='seu@email.com'
                                    required
                                />
                            </div>
                            <div className={ styles.grupo }>
                                <label className={ styles.label }>Senha</label>
                                <input
                                    className={ styles.input }
                                    type="password"
                                    name="senha"
                                    value={ form.senha }
                                    onChange={ handleChange }
                                    placeholder='Sua senha'
                                    required
                                />
                            </div>
                    
                            <button className={ styles.botao }>
                                Entrar
                            </button>
                        </form>
                        <p className={ styles.link }>
                            Não tem uma conta? <Link to="/register">Criar conta</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;