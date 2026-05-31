import { useState, useEffect } from 'react';

function useTema() {
    // Recupera a preferência salva no localStorage ou usa 'claro' como padrão
    const [tema, setTema] = useState(() => {
        return localStorage.getItem('tema') || 'claro';
    });

    useEffect(() => {
        // Aplica o atributo no elemento html
        if (tema === 'escuro') {
            document.documentElement.setAttribute('data-tema', 'escuro');
        } else {
            document.documentElement.removeAttribute('data-tema');
        }

        // Salva a preferência no localStorage
        localStorage.setItem('tema', tema);
    }, [tema]);

    const alternarTema = () => {
        setTema(atual => atual === 'claro' ? 'escuro' : 'claro');
    };

    return { tema, alternarTema };
}

export default useTema;