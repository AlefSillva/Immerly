import { Navigate } from 'react-router-dom';

// Verifica se o token existe, se não existir, redireciona para a página de login
function RotaPrivada({ children }) { 
    const token = localStorage.getItem('token');

    if ( !token ) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default RotaPrivada;