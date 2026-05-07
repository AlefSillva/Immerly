import { Link, useLocation } from 'react-router-dom';
import styles from './NavbarPublica.module.css';

function NavbarPublica() {
    const location = useLocation();

    return (
        <nav className={styles.navbar}>
            <span className={styles.logo}>Immerly</span>
            
            <div className={styles.navLinks}>
                {location.pathname === '/landing' && (
                    <>
                        <Link to='/login' className={styles.linkEntrar}>
                            Login
                        </Link>
                        <Link to='/register' className={styles.linkRegistrar}>
                            Cadastre-se
                        </Link>
                    </>
                )}

                {location.pathname === '/login' && (
                    <>
                        <Link to='/landing' className={styles.linkHome}>Home
                        </Link>
                        <Link to='/register' className={styles.linkRegistrar}>
                            Cadastre-se
                        </Link>
                    </>
                )}

                {location.pathname === '/register' && (
                    <>
                        <Link to='/landing' className={styles.linkHome}>
                            Home
                        </Link>
                        <Link to='/login' className={styles.linkLogin}>
                            Login
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default NavbarPublica;