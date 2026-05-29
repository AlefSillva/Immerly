import { BrowserRouter, Routes, Route, Navigate, Meta } from "react-router-dom";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import RotaPrivada from "./components/RotaPrivada";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Sessoes from "./pages/sessoes/Sessoes";
import Biblioteca from "./pages/biblioteca/Biblioteca";
import Metas from "./pages/metas/Metas";
import Landing from "./pages/landing/Landing";
import Ci from "./pages/ci/Ci";
import RotaAdmin from "./components/RotaAdmin";
import Admin from "./pages/admin/Admin";
import Perfil from './pages/perfil/Perfil';
import NaoEncontrado from './pages/naoEncontrado/NaoEncontrado';

function App() {
  const usuario = localStorage.getItem("usuario");
  let user = usuario ? JSON.parse(usuario) : null;

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Admin: protegida por autenticação + permissão de admin */}
        <Route
          path="/admin"
          element={
            <RotaAdmin>
              <Layout user={user}>
                <Admin />
              </Layout>
            </RotaAdmin>
          }
        />

        {/* Rota padrão */}
        <Route path="/" element={<Navigate to="/landing" replace />} />
        
        {/* Rota 404 — captura qualquer rota não encontrada */}
        <Route path="*" element={<NaoEncontrado />} />

        {/* Rotas públicas */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<Landing />} />

        {/* Rota Ci privada */}
        <Route
          path="/ci"
          element={
            localStorage.getItem("token") ? (
              <RotaPrivada>
                <Layout user={user}>
                  <Ci />
                </Layout>
              </RotaPrivada>
            ) : (
              <Ci />
            )
          }
        />

        {/* Rota Privada: Dashboard */}
        <Route
          path="/dashboard"
          element={
            <RotaPrivada>
              <Layout user={user}>
                <Dashboard />
              </Layout>
            </RotaPrivada>
          }
        />

        {/* Rota Privada: Sessões */}
        <Route
          path="/sessoes"
          element={
            <RotaPrivada>
              <Layout user={user}>
                <Sessoes />
              </Layout>
            </RotaPrivada>
          }
        />

        {/* Rota Privada: Biblioteca de Recursos*/}
        <Route
          path="/recursos"
          element={
            <RotaPrivada>
              <Layout user={user}>
                <Biblioteca />
              </Layout>
            </RotaPrivada>
          }
        />

        {/* Rota Privada: Metas */}
        <Route
          path="/metas"
          element={
            <RotaPrivada>
              <Layout user={user}>
                <Metas />
              </Layout>
            </RotaPrivada>
          }
        />

        {/* Rota Privada: Perfil */}
        <Route
          path="/perfil"
          element={
            <RotaPrivada>
              <Layout user={user}>
                <Perfil />
              </Layout>
            </RotaPrivada>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
