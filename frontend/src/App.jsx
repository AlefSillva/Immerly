import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/register/Register'
import Login from './pages/login/Login';
import RotaPrivada from './components/RotaPrivada';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={ 
          <RotaPrivada>
            <h1>Dashboard</h1>
          </RotaPrivada>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;