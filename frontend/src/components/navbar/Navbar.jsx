import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav>
            <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/sessoes">Registrar Sessão</Link></li>
                <li><Link to="/metas">Metas</Link></li>
                <li><Link to="/recursos">Biblioteca</Link></li>
                <li><Link to="/ci">Comprehensible Input</Link></li>
                
                <div>
                    <span>{ user?.nome }</span>
                    <button onClick={handleLogout}>Sair</button>
                </div>
            </ul>
        </nav>
    )
}

export default Navbar;