    import React, { useState, useEffect, useRef } from 'react';
    import io from 'socket.io-client';
    import PainelPedidos from '../components/PainelPedidos';
    import DashboardResumo from '../components/DashboardResumo';

    export default function AdminPanel() {
    const [tela, setTela] = useState('pedidos');
    const [pedidos, setPedidos] = useState([]);
    const [dashboardData, setDashboardData] = useState({
        totalEntregues: 0,
        vendasPorPagamento: { cartao: 0, pix: 0, dinheiro: 0 }
    });

    const [toast, setToast] = useState({ show: false, message: '' });
    const audioRef = useRef(null);

    useEffect(() => {
        const socket = io('http://localhost:5000');

        fetch('http://localhost:5000/pedidos')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setPedidos(data);
            else setPedidos([]);
        })
        .catch(err => console.error('Erro ao buscar pedidos:', err));

        socket.emit('getDashboardData');

        socket.on('novoPedido', (novo) => {
        setPedidos(prev => [novo, ...prev]);
        setToast({ show: true, message: `Novo pedido de ${novo.cliente.nome || 'Cliente'}` });

        if (audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Pode falhar se usuário não interagiu ainda
                console.log('Erro ao tentar reproduzir o som');
            });
            }
        }

        setTimeout(() => setToast({ show: false, message: '' }), 4000);
        });

        socket.on('pedidoEntregue', (pedidoAtualizado) => {
        setPedidos(prev =>
            prev.map(p => p._id === pedidoAtualizado._id ? pedidoAtualizado : p)
        );
        });

        socket.on('dashboardAtualizado', (data) => {
        setDashboardData(data);
        });

        return () => {
        socket.off('novoPedido');
        socket.off('pedidoEntregue');
        socket.off('dashboardAtualizado');
        socket.disconnect();
        };
    }, []);

    return (
        <div className="container py-4" style={{ marginTop: '70px' }}>
        <h2 className="text-warning text-center mb-4 fw-bold">Painel do Administrador</h2>

        <div className="d-flex justify-content-center mb-4 gap-3">
            <button
            className={`btn ${tela === 'pedidos' ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => setTela('pedidos')}
            >
            Pedidos em Andamento
            </button>
            <button
            className={`btn ${tela === 'dashboard' ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => setTela('dashboard')}
            >
            Dashboard de Vendas
            </button>
        </div>

        {tela === 'pedidos' && (
            <PainelPedidos
            pedidos={pedidos.filter(p => !p.entregue)}
            onMarcarEntregue={(pedidoAtualizado) => {
                setPedidos(prev =>
                prev.map(p => (p._id === pedidoAtualizado._id ? pedidoAtualizado : p))
                );
            }}
            />
        )}

        {tela === 'dashboard' && <DashboardResumo data={dashboardData} />}

        {/* Toast de notificação */}
        {toast.show && (
            <div
            className="toast show position-fixed top-0 end-0 m-3"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{ minWidth: '250px', zIndex: 1055 }}
            >
            <div className="toast-header bg-warning text-dark">
                <strong className="me-auto">Novo Pedido</strong>
                <button
                type="button"
                className="btn-close"
                onClick={() => setToast({ show: false, message: '' })}
                ></button>
            </div>
            <div className="toast-body bg-dark text-white">
                {toast.message}
            </div>
            </div>
        )}

        {/* Elemento audio oculto para o som de notificação */}
        <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto" />
        </div>
    );
    }
