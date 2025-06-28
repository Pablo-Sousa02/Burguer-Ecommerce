    import React, { useState, useEffect } from 'react';
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';
    import 'dayjs/locale/pt-br';
    import 'animate.css';

    dayjs.extend(relativeTime);
    dayjs.locale('pt-br');

    export default function PainelPedidos({ pedidos = [], onMarcarEntregue }) {
    const [listaPedidos, setListaPedidos] = useState(pedidos);
    const [pedidoConfirmadoId, setPedidoConfirmadoId] = useState(null);
    const [showConfirma, setShowConfirma] = useState(false);

    useEffect(() => {
        setListaPedidos(pedidos);
    }, [pedidos]);

    const TAXA_ENTREGA = 2;

    // Calcula total do pedido (soma itens + taxa entrega)
    const calcularTotal = (pedido) => {
        const totalItens = pedido.itens?.reduce((acc, item) => {
        return acc + item.price * item.quantity;
        }, 0) || 0;
        return totalItens + TAXA_ENTREGA;
    };

    const handleMarcarEntregue = async (id) => {
        try {
        const res = await fetch(`http://localhost:5000/pedidos/${id}/entregue`, {
            method: 'PUT',
        });

        if (!res.ok) throw new Error('Erro ao atualizar status');

        const atualizado = await res.json();

        setPedidoConfirmadoId(id);
        setShowConfirma(true);

        setTimeout(() => {
            setListaPedidos((atual) => atual.filter((p) => p._id !== id));
            setShowConfirma(false);
            setPedidoConfirmadoId(null);
        }, 1500);

        if (onMarcarEntregue) onMarcarEntregue(atualizado);
        } catch (err) {
        alert('Erro ao marcar como entregue');
        console.error(err);
        }
    };

    return (
        <div>
        <h2 className="text-warning mb-4 text-center">📦 Pedidos Recebidos</h2>

        {showConfirma && (
            <div
            className="alert alert-success text-center animate__animated animate__fadeInDown"
            role="alert"
            style={{
                position: 'fixed',
                top: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                width: '300px',
            }}
            >
            Pedido marcado como entregue! ✅
            </div>
        )}

        {listaPedidos.length === 0 ? (
            <p className="text-white text-center">Nenhum pedido recebido ainda.</p>
        ) : (
            <div className="table-responsive">
            <table className="table table-dark table-striped align-middle">
                <thead className="table-warning text-dark">
                <tr>
                    <th>Imagem</th>
                    <th>Cliente</th>
                    <th>Itens</th>
                    <th>Endereço</th>
                    <th>Pagamento</th>
                    <th>Troco</th>
                    <th>Recebido</th>
                    <th>Total</th>
                    <th>Ação</th>
                </tr>
                </thead>
                <tbody>
                {listaPedidos.map((pedido) => (
                    <tr
                    key={pedido._id}
                    className={
                        pedidoConfirmadoId === pedido._id
                        ? 'animate__animated animate__fadeOut'
                        : ''
                    }
                    >
                    <td style={{ width: '70px' }}>
                        {pedido.itens?.[0]?.image ? (
                        <img
                            src={pedido.itens[0].image}
                            alt={pedido.itens[0].name}
                            className="img-fluid rounded-circle border border-warning"
                            style={{ height: '50px', width: '50px', objectFit: 'cover' }}
                        />
                        ) : (
                        <div
                            className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white"
                            style={{ height: '50px', width: '50px', fontSize: '0.75rem' }}
                        >
                            Sem imagem
                        </div>
                        )}
                    </td>

                    <td className="fw-semibold text-light">
                        {pedido.cliente?.nome || 'Cliente não informado'}
                    </td>

                    <td>
                        {pedido.itens?.map((item, idx) => (
                        <div key={idx} className="mb-1">
                            <div>
                            {item.name}{' '}
                            <span className="badge bg-secondary">x{item.quantity}</span>
                            </div>
                            {/* Molhos opcionais */}
                            {item.molhosOpcionais && item.molhosOpcionais.length > 0 && (
                            <small
                                className="text-warning d-block"
                                style={{ fontSize: '0.8rem', marginLeft: '10px' }}
                            >
                                Molhos: {item.molhosOpcionais.join(', ')}
                            </small>
                            )}
                        </div>
                        ))}
                    </td>

                    <td className="text-info">
                        {pedido.cliente?.endereco ? (
                        <>
                            <strong>Rua:</strong> {pedido.cliente.endereco.rua}
                            <br />
                            <strong>Nº:</strong> {pedido.cliente.endereco.numero}
                            <br />
                            <strong>Bairro:</strong> {pedido.cliente.endereco.bairro}
                        </>
                        ) : (
                        'Endereço não informado'
                        )}
                    </td>

                    <td>
                        <span
                        className={`badge ${
                            pedido.pagamento?.forma === 'dinheiro' ? 'bg-success' : 'bg-primary'
                        }`}
                        >
                        {pedido.pagamento?.forma?.toUpperCase() || '-'}
                        </span>
                    </td>

                    <td>
                        {pedido.pagamento?.forma === 'dinheiro' && pedido.pagamento?.troco
                        ? `R$ ${Number(pedido.pagamento.troco).toFixed(2)}`
                        : '-'}
                    </td>

                    <td className="text-warning small">
                        <i className="bi bi-clock me-1"></i>
                        {pedido.criadoEm ? dayjs(pedido.criadoEm).fromNow() : '---'}
                    </td>

                    <td className="fw-bold text-warning" style={{ whiteSpace: 'nowrap' }}>
                        R$ {calcularTotal(pedido).toFixed(2)}
                    </td>

                    <td>
                        <button
                        className="btn btn-sm btn-outline-success fw-bold"
                        onClick={() => handleMarcarEntregue(pedido._id)}
                        disabled={pedidoConfirmadoId === pedido._id}
                        >
                        Entregue
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
    );
    }
