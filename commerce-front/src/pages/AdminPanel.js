    // ./pages/AdminPanel.js

    import React, { useState } from 'react';
    import PainelPedidos from '../components/PainelPedidos';
    import DashboardResumo from '../components/DashboardResumo';

    export default function AdminPanel() {
    const [tela, setTela] = useState('pedidos');

    return (
        <div className="container py-4" style={{ marginTop: '70px' }}>
        <h2 className="text-warning text-center mb-4 fw-bold">Painel do Administrador</h2>

        {/* Navegação entre as seções */}
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

        {/* Renderização condicional */}
        {tela === 'pedidos' && <PainelPedidos />}
        {tela === 'dashboard' && <DashboardResumo />}
        </div>
    );
    }
