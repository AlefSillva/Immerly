import { BrowserRouter, Routes, Route, Navigate, Meta } from 'react-router-dom';
import Register from './pages/register/Register'
import Login from './pages/login/Login';
import RotaPrivada from './components/RotaPrivada';
import Layout from './components/layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Sessoes from './pages/sessoes/Sessoes';
import Biblioteca from './pages/biblioteca/Biblioteca'
import Metas from './pages/metas/Metas'
import Landing from './pages/landing/Landing';

function App() {
  const usuario = localStorage.getItem('usuario');
  let user = usuario ? JSON.parse(usuario) : null;

  return (
    <BrowserRouter>
      
      <Routes>
        {/* Rota padrão */}
        <Route path="/" element={<Navigate to="/landing" replace/>} />
        
        { /* Rotas públicas */ }
        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path='/landing' element={<Landing />} />
        
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
        } />

        {/* Rota Privada: Metas */}
        <Route path='/metas' element={
          <RotaPrivada>
            <Layout user={user}>
              <Metas />
            </Layout>
          </RotaPrivada>
        } />
          

      </Routes>
    </BrowserRouter>
  )
}

export default App;