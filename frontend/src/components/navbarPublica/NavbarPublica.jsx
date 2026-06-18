import { Link, useLocation } from 'react-router-dom';
import styles from './NavbarPublica.module.css';
import { useState, useEffect } from 'react';

function NavbarPublica() {
    const [isMobile, setIsMobile] = useState(true);
    const location = useLocation();
    
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 576);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const atual = location.pathname;

    return (
        <nav className={styles.navbarPublica}>
            <span className={styles.logo}>Immerly</span>
            
            <div className={styles.navLinks}>
                {atual !== '/landing' ? (
                    <Link to='/landing' className={styles.linkHome}>Home</Link>
                ) : (
                    <Link to='/ci' className={styles.linkCi}>Pagina CI</Link>
                )}
                
                {atual !== '/login' && (
                    <Link to='/login' className={isMobile ? styles.linkEntrar : styles.linkLogin}>
                        Login
                    </Link>
                )}
                    
                {atual !== '/register' && <Link to='/register' className={styles.linkRegistrar}>Cadastre-se</Link>}

            </div>
        </nav>
    );
}

export default NavbarPublica;