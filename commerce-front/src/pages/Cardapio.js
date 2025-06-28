        import React from 'react';
        import ProductCard from '../components/ProductCard';
        import 'animate.css';

        const PRODUTOS = {
    hamburgueres: [
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
        name: 'Big Master Burger',
        description: 'Dois hambúrgueres, queijo extra e bacon.',
        price: 40.0,
        image: '/img/X-tudo.svg',
        },
    ],
    porcoes: [
        {
        id: 3,
        name: 'Batata Frita',
        description: 'Batata crocante com molho especial.',
        price: 15.0,
        image: '/img/BatataFrita.svg',
        },
        {
        id: 4,
        name: 'Onion Rings',
        description: 'Porção de carne frita com cebola.',
        price: 18.0,
        image: '/img/porçaocarne.svg',
        },
    ],
    frango: [
        {
        id: 5,
        name: 'Frango no Balde - 8 peças',
        description: 'Pedaços crocantes e suculentos com molho especial.',
        price: 42.0,
        image: '/img/frangobalde.svg',
        },
    ],
    bebidas: [
        {
        id: 6,
        name: 'Refrigerante Lata',
        description: 'Coca-Cola, Guaraná ou Pepsi 350ml.',
        price: 6.0,
        image: '/img/coca.svg',
        },
        {
        id: 7,
        name: 'Suco Natural',
        description: 'Laranja, Uva ou Abacaxi geladinho.',
        price: 7.5,
        image: '/img/suco.svg',
        },
    ],
    };


        export default function Cardapio({ onAddToCart }) {
        return (
            <div
            className="container py-5 text-white animate__animated animate__fadeIn"
            style={{ backgroundColor: '#1e1e1e', minHeight: '100vh', paddingTop: '80px' }}
            >
            <h2 className="mb-5 text-warning text-center display-4 fw-bold animate__animated animate__fadeInDown">
                Explore o Cardápio
            </h2>

            {Object.entries(PRODUTOS).map(([categoria, produtos]) => (
                <div key={categoria} className="mb-5">
                <h3 className="text-warning border-bottom border-warning pb-2 mb-4 text-uppercase fs-4">
                    {categoria === 'hamburgueres' && '🍔 Hambúrguer Artesanal'}
                    {categoria === 'porcoes' && '🍟 Porções'}
                    {categoria === 'frango' && '🍗 Frango no Balde'}
                    {categoria === 'bebidas' && '🥤 Bebidas'}
                </h3>

                {/* Container com scroll horizontal no mobile e grid no desktop */}
                <div
                    className="d-flex flex-row flex-nowrap overflow-auto"
                    style={{
                    gap: '1rem',
                    scrollSnapType: 'x mandatory',
                    paddingBottom: '1rem',
                    // Força grid em telas maiores
                    flexWrap: window.innerWidth >= 768 ? 'wrap' : 'nowrap',
                    }}
                >
                    {produtos.map((product, i) => (
                    <div
                        key={product.id}
                        className="flex-shrink-0"
                        style={{
                        scrollSnapAlign: 'start',
                        width: '80vw', // tamanho no mobile
                        maxWidth: '300px', // limite desktop
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.5s',
                        }}
                    >
                        <ProductCard product={product} onAddToCart={onAddToCart} />
                    </div>
                    ))}
                </div>
                </div>
            ))}
            </div>
        );
        }
