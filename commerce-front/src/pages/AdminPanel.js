import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import PainelPedidos from '../components/PainelPedidos';
import DashboardResumo from '../components/DashboardResumo';
import AdminToast from '../components/AdminToast';

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
      setToast({ show: true, message: `Novo pedido de ${novo.cliente?.nome || 'Cliente'}` });

      if (audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => console.log('Erro ao tentar reproduzir o som'));
        }
      }

      setTimeout(() => setToast({ show: false, message: '' }), 4000);
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

  // Hook para registrar service worker e pedir permissão de push
  useEffect(() => {
    function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    async function subscribeUserToPush() {
      try {
        const registration = await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY),
        });

        console.log('Subscription gerada:', subscription);

        // Envie para seu backend salvar a subscription
        await fetch(`${process.env.REACT_APP_API_URL}/save-subscription`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        });

        console.log('Subscription enviada para backend com sucesso');
      } catch (error) {
        console.error('Erro ao criar subscription push:', error);
      }
    }

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registrado:', registration);
          return Notification.requestPermission();
        })
        .then(permission => {
          if (permission === 'granted') {
            console.log('Permissão para notificações concedida');
            subscribeUserToPush();
          } else {
            console.log('Permissão para notificações negada');
          }
        })
        .catch(error => {
          console.error('Erro ao registrar Service Worker:', error);
        });
    } else {
      console.warn('Push messaging não é suportado neste navegador.');
    }
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

      <AdminToast toast={toast} setToast={setToast} audioRef={audioRef} />
    </div>
  );
}
