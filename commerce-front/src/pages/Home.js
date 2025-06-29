        import React from 'react';
        import ProductCard from '../components/ProductCard';
        import { Link } from 'react-router-dom';
        const DESTAQUES = [
        {
            id: 1,
            name: 'Hambúrguer Clássico',
            description: 'Pão, hambúrguer, queijo, alface, tomate e maionese.',
            price: 25.0,
            image: '/img/Hambúrguerclassico.svg',
        },
        {
            id: 2,
            name: 'Cheeseburguer Duplo',
            description: 'Dois hambúrgueres, queijo extra e bacon.',
            price: 35.0,
            image: '/img/CheeseburguerDuplo.svg',
        },
        {
            id: 3,
            name: 'Batata Frita',
            description: 'Batata crocante com molho especial.',
            price: 15.0,
            image: '/img/batataFrita.svg',
        },
        ];

        export default function Home({ onAddToCart }) {
        return (
            <div
            className="container py-5 text-white"
            style={{ backgroundColor: '#1e1e1e', minHeight: '100vh', paddingTop: '80px' }}
            >
            {/* Texto e imagem principal */}
            <div className="row align-items-center mb-5">
                <div className="col-md-6 mb-4 mb-md-0">
                <h1 className="display-4 text-warning fw-bold">Bem-vindo ao Maravilhas Burguer!</h1>
                <p className="lead">
                    Os melhores hambúrgueres da cidade, preparados com ingredientes frescos e muito sabor.
                </p>
                <p style={{ color: 'gray' }}>
                    Faça seu pedido agora e aproveite nossa entrega rápida e opções de pagamento práticas.
                </p>
                </div>
                <div className="col-md-6">
                <img
                    src="/img/homeimage.svg"
                    alt="Hamburguer delicioso"
                    className="img-fluid rounded shadow"
                />
                </div>
            </div>

            {/* Destaques do cardápio */}
            <h2 className="mb-4 text-warning">Destaques do Cardápio</h2>
            <div className="row g-4 mb-5">
                {DESTAQUES.map((product) => (
                <div key={product.id} className="col-sm-6 col-md-4">
                    <ProductCard product={product} onAddToCart={onAddToCart} />
                </div>
                
                ))}
                <div className="text-center mt-4">
    <Link
        to="/cardapio"
        className="btn btn-warning btn-lg px-5 py-3 fw-bold shadow-lg"
        style={{
        borderRadius: '50px',
        fontSize: '1.2rem',
        animation: 'pulse 2s infinite',
        }}
    >
        Ver Cardápio Completo 🍔
    </Link>
    </div>

    {/* Animação pulse (adicione dentro do JSX, logo antes do return ou no final do componente) */}
    <style>
    {`
        @keyframes pulse {
        0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7);
        }
        70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 15px rgba(255, 193, 7, 0);
        }
        100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
        }
        }
    `}
    </style>
            </div>
            </div>
        );
        }
