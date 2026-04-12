import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api'
import styles from './Login.module.css'

function Login() {
    // Hook para navegação programática
    const navigate = useNavigate();

    // Estado para armazenar os dados do formulário de login e mensagens de erro
    const [ form, setForm ] = useState({ email: '', senha: '' });
    const [erro, setErro] = useState('');
    
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
        setErro('');

        try {
            const resposta = await api.post('/auth/login', form);

            // Salva o token no localStorage para o interceptador do Axios usar
            localStorage.setItem('token', resposta.data.token);
            navigate('/dashboard');
        } catch (err) {
            setErro(err.response?.data?.message || 'Email ou senha incorretos.');
        }
    };

    return (
        <div className={ styles.container }>
            <div className={ styles.card }>
                <h1 className={ styles.titulo }>Immerly</h1>
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

                    {/* Exibe a mensagem de erro, se houver */}
                    { erro && <p className={styles.erro}>{ erro }</p> }
                    
                    <button className={ styles.botao }>
                        Entrar
                    </button>
                </form>

                <p className={ styles.link }>
                    Não tem uma conta? <Link to="/register">Criar conta</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;