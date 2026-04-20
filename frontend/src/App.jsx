import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/register/Register'
import Login from './pages/login/Login';
import RotaPrivada from './components/RotaPrivada';
import Layout from './components/layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Sessoes from './pages/sessoes/Sessoes';
import Biblioteca from  './pages/biblioteca/Biblioteca'

function App() {
  const usuario = localStorage.getItem('usuario');
  let user = usuario ? JSON.parse(usuario) : null;

  return (
    <BrowserRouter>
      
      <Routes>
        {/* Rota padrão */}
        <Route path="/" element={<Navigate to="/login" replace/>} />
        
        { /* Rotas públicas */ }
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        { /* Rota Privada: Dashboard */ }
        <Route path="/dashboard" element={ 
          <RotaPrivada>
            <Layout user={user}>
              <Dashboard />
            </Layout>
          </RotaPrivada>
        } />

        { /* Rota Privada: Sessões */}
        <Route path="/sessoes" element={
          <RotaPrivada>
            <Layout user={ user }>
              <Sessoes />
            </Layout>
          </RotaPrivada>
        }
        />

        { /* Rota Privada: Biblioteca de Recursos*/}
        <Route path='/recursos' element={
          <RotaPrivada>
            <Layout user={user}>
              <Biblioteca />
            </Layout>
          </RotaPrivada>
        }

        />

      </Routes>
    </BrowserRouter>
  )
}

export default App;