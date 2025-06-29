import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import PainelPedidos from '../components/PainelPedidos';
import DashboardResumo from '../components/DashboardResumo';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminPanel() {
  const [tela, setTela] = useState('pedidos');
  const [pedidos, setPedidos] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalEntregues: 0,
    vendasPorPagamento: { cartao: 0, pix: 0, dinheiro: 0 }
  });

  const audioRef = useRef(null);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL;

    const socket = io(API_URL, {
      transports: ['polling', 'websocket'],
    });

    fetch(`${API_URL}/pedidos`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPedidos(data);
        else setPedidos([]);
      })
      .catch(err => console.error('Erro ao buscar pedidos:', err));

    socket.on('novoPedido', (novo) => {
      setPedidos(prev => [novo, ...prev]);

      toast.info(`📢 Novo pedido de ${novo.cliente?.nome || 'Cliente'}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        onOpen: () => {
          if (audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => console.log('Erro ao tentar reproduzir o som'));
            }
          }
        }
      });
    });

    socket.on('pedidoEntregue', (pedidoAtualizado) => {
      setPedidos(prev => prev.map(p => (p._id === pedidoAtualizado._id ? pedidoAtualizado : p)));
    });

    socket.on('dashboardAtualizado', (data) => {
      setDashboardData(data);
    });

    socket.on('connect', () => console.log('Socket conectado:', socket.id));
    socket.on('connect_error', (err) => console.error('Erro conexão socket:', err));
    socket.on('disconnect', (reason) => console.log('Socket desconectado:', reason));

    return () => {
      socket.off('novoPedido');
      socket.off('pedidoEntregue');
      socket.off('dashboardAtualizado');
      socket.disconnect();
    };
  }, []);

  // ... seu useEffect para Service Worker permanece o mesmo

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

      <audio ref={audioRef} src="/sounds/notification.mp3" />

      {/* ToastContainer deve estar presente no JSX para mostrar os toasts */}
      <ToastContainer />
    </div>
  );
}
