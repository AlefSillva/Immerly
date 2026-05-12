import { Navigate } from 'react-router-dom';

// Verifica se o usuário está autenticado E é admin
// Se não for, redireciona para o dashboard
function RotaAdmin({ children }) {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    const user = usuario ? JSON.parse(usuario) : null;

    if (!token || !user?.is_admin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default RotaAdmin;