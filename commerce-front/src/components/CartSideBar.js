    // src/components/CartSidebar.js
    import React from 'react';
    import { useNavigate } from 'react-router-dom';

    export default function CartSidebar({ cartItems, onRemoveFromCart, onClose }) {
    const navigate = useNavigate();

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <>
        {cartItems.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
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

            <h6 className="text-warning fw-bold">Total: R$ {total.toFixed(2)}</h6>

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
