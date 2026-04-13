import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

import Navbar from '../../components/navbar/Navbar';
import styles from './Ci.module.css';

function Ci() {
    const [user, setUser] = useState({ nome: 'Usuário' });
    

    const handleUserChange = (novoUsuario) => {
        setUser(novoUsuario);
    }

    return (
        <div className={ styles.container }>
            <Navbar user={user} onUserChange={handleUserChange} /> 
            <h1>Comprehensible Input</h1>
            <p>Conteúdo para a seção de Comprehensible Input</p>
        </div>
    )
}

export default Ci;