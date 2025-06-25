    import React, { useState } from 'react';

    export default function ProductCard({ product, onAddToCart }) {
    const [quantity, setQuantity] = useState(1);

    function handleAdd() {
        if (quantity < 1) return;
        onAddToCart(product, quantity);
        setQuantity(1);
    }

    return (
        <div
        className="card bg-dark text-white shadow-sm h-100"
        style={{
            borderRadius: '1rem',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 193, 7, 0.7)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        }}
        >
        <img
            src={product.image}
            alt={product.name}
            className="card-img-top"
            style={{ height: '180px', objectFit: 'cover', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
        />

        <div className="card-body d-flex flex-column p-3">
            <h5 className="card-title mb-2 fw-bold" style={{ fontSize: '1.25rem' }}>
            {product.name}
            </h5>
            <p className="card-text flex-grow-1 mb-3 text-secondary" style={{ fontSize: '0.95rem' }}>
            {product.description}
            </p>

            <div className="d-flex align-items-center mb-3">
            <input
                type="number"
                min="1"
                className="form-control form-control-sm me-2 bg-dark text-white border-warning"
                style={{ width: '70px', fontWeight: '600', textAlign: 'center' }}
                value={quantity}
                onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setQuantity(val > 0 ? val : 1);
                }}
            />
            <button
                className="btn btn-warning btn-sm fw-semibold"
                onClick={handleAdd}
                style={{ flexShrink: 0, fontWeight: '700', letterSpacing: '0.5px' }}
            >
                Adicionar
            </button>
            </div>

            <p className="fw-bold mb-0" style={{ fontSize: '1.15rem', color: '#ffc107' }}>
            R$ {product.price.toFixed(2)}
            </p>
        </div>
        </div>
    );
    }
