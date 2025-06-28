    import React from 'react';
    import { useNavigate } from 'react-router-dom';

    export default function CartSidebar({ cartItems = [], onRemoveFromCart, onClose }) {
    const navigate = useNavigate();

    const TAXA_ENTREGA = 2;

    const totalItens = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const total = totalItens + (cartItems.length > 0 ? TAXA_ENTREGA : 0);

    return (
        <>
        {cartItems.length === 0 ? (
            <p className="text-white">Seu carrinho está vazio.</p>
        ) : (
            <>
            <ul className="list-group mb-3">
                {cartItems.map((item) => (
                <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-warning"
                >
                    <div className="d-flex align-items-center">
                    <img
                        src={item.image}
                        alt={item.name}
                        style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '5px',
                        }}
                        className="me-3"
                    />
                    <div>
                        <div>{item.name}</div>

                        {/* Molhos opcionais, se houver */}
                        {item.molhosOpcionais && item.molhosOpcionais.length > 0 && (
                        <small
                            className="text-warning d-block"
                            style={{ fontSize: '0.85rem', fontStyle: 'italic' }}
                        >
                            Molhos: {item.molhosOpcionais.join(', ')}
                        </small>
                        )}

                        <small className="text-warning">x {item.quantity}</small>
                    </div>
                    </div>
                    <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => onRemoveFromCart(item.id)}
                    >
                    Remover
                    </button>
                </li>
                ))}
            </ul>

            {/* Observação da taxa fixa */}
            <div className="mb-2 text-warning fst-italic" style={{ fontSize: '0.9rem' }}>
                * Taxa fixa de entrega: R$ {TAXA_ENTREGA.toFixed(2)}
            </div>

            <h6 className="text-warning fw-bold">
                Total: R$ {total.toFixed(2)}
            </h6>

            <button
                className="btn btn-warning w-100 mt-3"
                onClick={() => {
                onClose();
                navigate('/checkout');
                }}
            >
                Finalizar Pedido
            </button>
            </>
        )}
        </>
    );
    }
