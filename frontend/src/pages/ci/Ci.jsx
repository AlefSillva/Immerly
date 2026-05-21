import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import NavbarPublica from '../../components/navbarPublica/NavbarPublica';
import styles from './Ci.module.css';

function Ci() {
    const [conteudo, setConteudo] = useState('');
    const [erro, setErro] = useState('');
    
    useEffect(() => {
        const buscarCI = async () => {
            try {
                const resposta = await api.get('/ci');
                setConteudo(resposta.data);
            } catch (err) {
                setErro(err.response?.data?.message || 'Erro ao carregar o conteúdo. Por favor, tente novamente mais tarde.');
            }
        };

        buscarCI();
    }, []);

    const token = localStorage.getItem('token');

    return (
        <div className={styles.container}>
            {!token && <NavbarPublica />}

            { erro && <p className={styles.erro}>{erro}</p> }
        
            {conteudo && (
                <main className={ styles.conteudo }>
                    <div className={ styles.hero }>
                        <h1 className={ styles.titulo}>{ conteudo.titulo }</h1>
                        <p className={ styles.descricao }>{ conteudo.descricao }</p>
                    </div>

                    <div className={ styles.formula }>
                        <span className={styles.formulaTexto}>{conteudo.formula}</span>
                    </div>

                        <h2 className={ styles.secaoTituloVideo}>O criador da teoria</h2>
                        
                        <div className={styles.videoWrappers}>
                            <iframe
                                src="https://www.youtube.com/embed/fnUc_W3xE1w"
                                title="Stephen Krashen - Language Acquisition and Comprehensible Input"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        

                    <div className={ styles.secao }>
                        <h2 className={ styles.secaoTitulo }>Princípios fundamentais</h2>
                        <div className={ styles.principios }>
                            {conteudo.principios.map((principio, idx) => (
                                <div key={ idx} className={ styles.principioCard }>
                                    <span className={styles.numero}>{ idx + 1 }</span>
                                    <p>{ principio }</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={ styles.secao }>
                        <h2 className={ styles.secaoTitulo }>Saiba mais</h2>
                        <div className={ styles.links }>
                            {conteudo.links.map((link, idx) => (
                                <a
                                    key = { idx }
                                    href = { link.url }
                                    target = "_blank"
                                    rel = "noopener noreferrer"
                                    className = { styles.linkCard }
                                >
                                    <span className={styles.LinkNome}>{ link.nome }</span>
                                    <span className={styles.linkDescricao}>{ link.descricao }</span>
                                    <span className={ styles.linkAcessar }>Acessar </span>
                                </a>
                            ))}
                        </div>

                        {!token && (
                            <div className={styles.cta}>
                            <h2>Pronto para começar sua imersão?</h2>
                            <p>Registre suas sessões e acompanhe sua evolução com o Immerly.</p>
                            <Link to="/register" className={styles.ctaBotao}>
                                Criar conta grátis
                            </Link>
                        </div>
                        )}
                    </div>
                </main>
            )}
        </div>
    );
    
}

export default Ci;