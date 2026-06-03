import { createContext, useContext } from 'react';
import useToast from '../hooks/useToast';
import Toast from '../components/toast/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const { toasts, adicionarToast } = useToast();

    return (
        <ToastContext.Provider value={{ adicionarToast }}>
            {children}
            <Toast toasts={toasts} />
        </ToastContext.Provider>
    );
}

export function useToastContext() {
    return useContext(ToastContext);
}