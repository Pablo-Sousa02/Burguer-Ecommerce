import React, { useEffect, useState } from 'react';

export default function DashboardResumo() {
  const [dados, setDados] = useState({
    totalVendas: 0,
    totalPedidos: 0,
    totalEntregues: 0,
    vendasPorPagamento: {
      dinheiro: 0,
      cartao: 0,
      pix: 0,
    },
    ticketMedio: 0,
    totalItensVendidos: 0,
  });

  useEffect(() => {
    // Aqui vamos buscar do back-end futuramente
    async function fetchDadosDashboard() {
      try {
        // const response = await fetch('/api/admin/dashboard');
        // const result = await response.json();
        // setDados(result);

        // MOCK para testes (remover depois)
        setDados({
          totalVendas: 0.0,
          totalPedidos: 0,
          totalEntregues: 0,
          vendasPorPagamento: {
            dinheiro: 0.0,
            cartao: 0.0,
            pix: 0.0,
          },
          ticketMedio: 0.0,
          totalItensVendidos: 0,
        });
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      }
    }

    fetchDadosDashboard();
  }, []);

  return (
    <div className="text-white">
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="bg-success bg-opacity-75 p-3 rounded shadow-sm">
            <h5>Total Vendido</h5>
            <h3 className="fw-bold">R$ {dados.totalVendas.toFixed(2)}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-primary bg-opacity-75 p-3 rounded shadow-sm">
            <h5>Pedidos Entregues</h5>
            <h3 className="fw-bold">{dados.totalEntregues}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-info bg-opacity-75 p-3 rounded shadow-sm">
            <h5>Total de Pedidos</h5>
            <h3 className="fw-bold">{dados.totalPedidos}</h3>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="bg-warning bg-opacity-75 p-3 rounded shadow-sm">
            <h5>Dinheiro 💵</h5>
            <p className="fw-bold">R$ {dados.vendasPorPagamento.dinheiro.toFixed(2)}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-light text-dark bg-opacity-75 p-3 rounded shadow-sm">
            <h5>Cartão 💳</h5>
            <p className="fw-bold">R$ {dados.vendasPorPagamento.cartao.toFixed(2)}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-secondary bg-opacity-75 p-3 rounded shadow-sm">
            <h5>PIX 📱</h5>
            <p className="fw-bold">R$ {dados.vendasPorPagamento.pix.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="bg-dark border border-light p-3 rounded shadow-sm">
            <h5>Itens Vendidos</h5>
            <p className="fw-bold">{dados.totalItensVendidos}</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="bg-dark border border-light p-3 rounded shadow-sm">
            <h5>Ticket Médio</h5>
            <p className="fw-bold">R$ {dados.ticketMedio.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
// Esse componente exibe um resumo do dashboard com dados de vendas, pedidos e pagamentos