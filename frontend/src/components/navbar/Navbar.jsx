import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar({ user }) {
    const [ isOpen, setIsOpen ] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
            {!isOpen && (
                <button 
                    onClick={toggleMenu} 
                    className={styles.openbtn}
                >
                    &#9776; 
                </button>
            )}

            <div className={styles.navbar} style={{ width: isOpen ? '250px' : '0' }}>
            
            <button
                className={styles.closebtn}
                onClick={toggleMenu}>
                    &times;
            </button>
                
            <Link to="/" className={ styles.link }>Dashboard</Link>
            <Link to="/sessoes" className={ styles.link }>Registrar Sessão</Link>
            <Link to="/metas" className={ styles.link }>Metas</Link>
            <Link to="/recursos" className={ styles.link }>Biblioteca</Link>
            <Link to="/ci" className={ styles.link }>Comprehensible Input</Link>
                
            <div className={ styles.userInfo }>
                <span>{ user?.nome }</span>
                
                {isOpen && (
                    <button
                        onClick={handleLogout}
                        className={ styles.logoutButton }
                >
                    Sair
                </button>
                )}
            </div>
        
        </div>
        </>
    )
}

export default Navbar;