import { Link } from 'react-router-dom';
import styles from './Landing.module.css';
import NavbarPublica from '../../components/navbarPublica/navbarPublica';

function Landing() { 
    return (
        <div className={styles.container}>

            <NavbarPublica  />

            <main className={styles.mainContent}>
                <div className={styles.mainTexto}>
                    <h1 className={styles.titulo}>Bem-vindo ao Immerly <br />
                        <span className={styles.destaque}>Track your immersion</span>
                    </h1>

                    <p className={styles.subtitulo}>Immerly é uma plataforma de tracking baseada no método
                        Comprehensible Input para aprendizado de línguas. Registre suas sessões,
                        acompanhe seu progresso e se mantenha motivado durante sua jornada de aprendizado.
                    </p>

                    <div className={styles.botoes}>
                        <Link to='/register' className={styles.btnPrimario}>
                            Começar agora - é grátis
                        </Link>

                        <Link to='/login' className={styles.btnSecundario}>
                            Já tenho uma conta
                        </Link>
                    </div>
                </div>

                <div className={styles.mainCards}>
                    <div className={ styles.card}>
                        <span className={styles.cardIcone}>📊</span>
                        <h3>Dashboard completo</h3>
                        <p>Visualize suas horas, streak e evolução com graficos detalhados.</p>
                    </div>

                    <div className={ styles.card}>
                        <span className={styles.cardIcone}>🎯</span>
                        <h3>Metas personalizadas</h3>
                        <p>Defina metas semanais e mensais e acompanhe seu progresso.</p>
                    </div>

                    <div className={ styles.card}>
                        <span className={styles.cardIcone}>📚</span>
                        <h3>Biblioteca de recursos</h3>
                        <p>Acesse uma ampla coleção de materiais auxiliares de estudo e exercícios.</p>
                    </div>

                    <div className={ styles.card}>
                        <span className={styles.cardIcone}>🧠</span>
                        <h3>Aprendizado por imersão</h3>
                        <p>Baseado na teoria de Comprehensible Input de Stephen Krashen.</p>
                    </div>

                </div>
            </main>

        </div>
    );
}

export default Landing;