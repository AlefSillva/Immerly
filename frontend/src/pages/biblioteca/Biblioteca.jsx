import { useState, useEffect } from 'react';
import api from '../../services/api';
import Carrossel from '../../components/carrossel/Carrossel';
import styles from './Biblioteca.module.css'


const NIVEIS = ['A1', 'A2', 'B1', 'B2', 'C1'];

function Biblioteca() {
    const [recursos, setRecursos] = useState([]);
    const [erro, setErro] = useState('');

    useEffect(() => {
        const buscarRecursos = async () => {
            try {
                const resposta = await api.get('/recursos');
                setRecursos(resposta.data.recursos);
            } catch (err) {
                setErro(err.data.message || 'Erro ao carregar recursos.')
            }
        };

        buscarRecursos();
    }, [])

    const porNivel = (nivel) => recursos.filter((r) => r.nivel === nivel);

    const ferramentas = recursos.filter((r) => !r.nivel);

    return ( 
        <div className={styles.container}>
            <h1 className={styles.titulo}>Biblioteca</h1>
            <p className={styles.subtitulo}>Recursos curados para sua imersão</p>

            {erro && <p className={styles.erro}>{erro}</p>}
            
            <div className={styles.secoes}>
                {NIVEIS.map((nivel) => (
                    <Carrossel
                        key={nivel}
                        titulo={nivel}
                        recursos={porNivel(nivel)}
                    />
                ))}

                <Carrossel
                    titulo="Ferramentas"
                    recursos={ferramentas}
                />
            </div>
        </div>    
    );
}

export default Biblioteca;