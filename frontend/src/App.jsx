import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/register/Register'
import Login from './pages/login/Login';
import RotaPrivada from './components/RotaPrivada';
import Layout from './components/layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  const usuario = localStorage.getItem('usuario');
  let user = usuario ? JSON.parse(usuario) : null;

  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        

        <Route path="/dashboard" element={ 
          <RotaPrivada>
            <Layout user={ user }>
              <Dashboard />
            </Layout>
          </RotaPrivada>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;