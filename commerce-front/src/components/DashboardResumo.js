import React, { useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

export default function DashboardResumo() {
  const [pedidos, setPedidos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);

  // Usar useMemo para calcular dados derivados, só recalcula quando "pedidos" muda
  const dados = useMemo(() => {
    const totalPedidos = pedidos.length;
    const entregues = pedidos.filter(p => p.entregue);
    const totalEntregues = entregues.length;
    const totalVendas = entregues.reduce((acc, p) => acc + (p.total || 0), 0);
    const vendasPorPagamento = { dinheiro: 0, cartao: 0, pix: 0 };
    let totalItensVendidos = 0;

    entregues.forEach(p => {
      const forma = p.pagamento?.forma?.toLowerCase() || 'outros';
      if (vendasPorPagamento.hasOwnProperty(forma)) {
        vendasPorPagamento[forma] += p.total || 0;
      } else {
        vendasPorPagamento.outros = (vendasPorPagamento.outros || 0) + (p.total || 0);
      }

      p.itens?.forEach(item => {
        totalItensVendidos += item.quantity || 0;
      });
    });

    const ticketMedio = totalEntregues > 0 ? totalVendas / totalEntregues : 0;

    return {
      totalVendas,
      totalPedidos,
      totalEntregues,
      vendasPorPagamento,
      ticketMedio,
      totalItensVendidos,
    };
  }, [pedidos]);

  // Pedidos entregues para modal
  const pedidosEntregues = useMemo(() => pedidos.filter(p => p.entregue), [pedidos]);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const resAndamento = await fetch(process.env.REACT_APP_API_URL + '/pedidos?entregue=false');
        const pedidosEmAndamento = await resAndamento.json();

        const resEntregues = await fetch(process.env.REACT_APP_API_URL + '/pedidos?entregue=true');
        const pedidosEntregues = await resEntregues.json();

        setPedidos([...pedidosEmAndamento, ...pedidosEntregues]);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      }
    }

    fetchPedidos();

    socket.on('pedidoEntregue', (pedidoAtualizado) => {
      setPedidos((prevPedidos) =>
        prevPedidos.map(p => (p._id === pedidoAtualizado._id ? pedidoAtualizado : p))
      );
    });

    socket.on('novoPedido', (pedidoNovo) => {
      setPedidos((prevPedidos) => [pedidoNovo, ...prevPedidos]);
    });

    return () => {
      socket.off('pedidoEntregue');
      socket.off('novoPedido');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="text-white">
      {/* Cards métricas */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="bg-success bg-opacity-75 p-3 rounded shadow-sm">
            <h5>Total Vendido</h5>
            <h3 className="fw-bold">R$ {dados.totalVendas.toFixed(2)}</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="bg-primary bg-opacity-75 p-3 rounded shadow-sm">
            <h5>Pedidos Entregues</h5>
            <h3 className="fw-bold">{dados.totalEntregues}</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="bg-info bg-opacity-75 p-3 rounded shadow-sm">
            <h5>Total de Pedidos</h5>
            <h3 className="fw-bold">{dados.totalPedidos}</h3>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="bg-warning bg-opacity-75 p-3 rounded shadow-sm">
            <h5>Dinheiro 💵</h5>
            <p className="fw-bold">R$ {dados.vendasPorPagamento.dinheiro.toFixed(2)}</p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="bg-light text-dark bg-opacity-75 p-3 rounded shadow-sm">
            <h5>Cartão 💳</h5>
            <p className="fw-bold">R$ {dados.vendasPorPagamento.cartao.toFixed(2)}</p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="bg-secondary bg-opacity-75 p-3 rounded shadow-sm">
            <h5>PIX 📱</h5>
            <p className="fw-bold">R$ {dados.vendasPorPagamento.pix.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="bg-dark border border-light p-3 rounded shadow-sm">
            <h5>Itens Vendidos</h5>
            <p className="fw-bold">{dados.totalItensVendidos}</p>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="bg-dark border border-light p-3 rounded shadow-sm">
            <h5>Ticket Médio</h5>
            <p className="fw-bold">R$ {dados.ticketMedio.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Botão para abrir modal */}
      <button
        className="btn btn-outline-light my-3"
        onClick={() => setModalAberto(true)}
      >
        Ver Pedidos Entregues
      </button>

      {/* Modal responsivo */}
      {modalAberto && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          onClick={() => setModalAberto(false)}
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <div
            className="modal-dialog modal-lg"
            role="document"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Pedidos Entregues</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setModalAberto(false)}
                ></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {pedidosEntregues.length === 0 ? (
                  <p>Nenhum pedido entregue recentemente.</p>
                ) : (
                  <div className="row g-3">
                    {pedidosEntregues.map(pedido => (
                      <div key={pedido._id} className="col-12">
                        <div className="card bg-secondary text-white">
                          <div className="card-body">
                            <h6 className="card-title mb-1">
                              Cliente: {pedido.cliente?.nome || '-'}
                            </h6>
                            <p className="mb-1">Total: R$ {pedido.total.toFixed(2)}</p>
                            <p className="mb-1">Pagamento: {pedido.pagamento?.forma || '-'}</p>
                            <p className="mb-0">
                              Entregue em: {new Date(pedido.criadoEm).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
