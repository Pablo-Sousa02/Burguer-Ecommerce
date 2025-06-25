    // src/components/PainelPedidos.js
    import React from 'react';

    export default function PainelPedidos({ pedidos = [], onMarcarEntregue }) {
    return (
        <div>
        <h2 className="text-warning mb-4">Pedidos Recebidos</h2>

        {/* Se não houver pedidos, exibe mensagem */}
        {pedidos.length === 0 ? (
            <p className="text-white">Nenhum pedido recebido ainda.</p>
        ) : (
            <table className="table table-dark table-striped">
            <thead>
                <tr>
                <th>Cliente</th>
                <th>Itens</th>
                <th>Endereço</th>
                <th>Pagamento</th>
                <th>Troco</th>
                <th>Ação</th>
                </tr>
            </thead>
            <tbody>
                {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                    {/* Nome do cliente */}
                    <td>{pedido.clienteNome || 'Nome não informado'}</td>

                    {/* Lista de itens - garante que seja um array para evitar erro */}
                    <td>
                    {(pedido.itens || []).map((item, idx) => (
                        <div key={idx}>
                        {item.name || 'Produto'} x{item.quantity || 1}
                        </div>
                    ))}
                    </td>

                    {/* Endereço */}
                    <td>{pedido.endereco || '-'}</td>

                    {/* Forma de pagamento */}
                    <td>{pedido.formaPagamento || '-'}</td>

                    {/* Troco, formatado para 2 casas decimais ou hífen */}
                    <td>
                    {pedido.troco !== undefined && pedido.troco !== null
                        ? `R$ ${pedido.troco.toFixed(2)}`
                        : '-'}
                    </td>

                    {/* Botão para marcar como entregue */}
                    <td>
                    <button
                        className="btn btn-sm btn-success"
                        onClick={() => onMarcarEntregue(pedido.id)}
                    >
                        Marcar como entregue
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    );
    }
