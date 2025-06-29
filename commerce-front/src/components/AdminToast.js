    import { useEffect, useState } from 'react';

    export default function AdminToast({ socket }) {
    const [show, setShow] = useState(false);
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        if (!socket) return;

        socket.on('novoPedido', (pedido) => {
        const nome = pedido?.cliente?.nome || 'Cliente';
        setMensagem(`🛎️ Novo pedido de ${nome}`);
        setShow(true);

        setTimeout(() => {
            setShow(false);
        }, 5000);
        });

        return () => {
        socket.off('novoPedido');
        };
    }, [socket]);

    return (
        <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 9999 }}
        >
        <div
            className={`toast text-white bg-success ${show ? 'show' : 'hide'}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div className="toast-header bg-success text-white">
            <strong className="me-auto">Maravilhas Burguer</strong>
            <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShow(false)}
            ></button>
            </div>
            <div className="toast-body">{mensagem}</div>
        </div>
        </div>
    );
    }
    // This component listens for new orders via a socket connection and displays a toast notification when a new order is received.