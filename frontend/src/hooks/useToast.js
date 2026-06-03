import { useState, useCallback } from 'react';

function useToast() {
    const [toasts, setToasts] = useState([]);

    const adicionarToast = useCallback((mensagem, tipo = 'sucesso') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, mensagem, tipo }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return { toasts, adicionarToast };
}

export default useToast;