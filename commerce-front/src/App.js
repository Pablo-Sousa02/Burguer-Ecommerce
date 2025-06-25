import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cardapio from './pages/Cardapio';
import CartSideBar from './components/CartSideBar';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/PrivateRoute'; // rota protegida

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  function handleAddToCart(product, quantity) {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }

  function handleRemoveFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }

  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
        <Route path="/cardapio" element={<Cardapio onAddToCart={handleAddToCart} />} />
        <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* Botão flutuante do carrinho */}
      <button
        className="btn btn-warning position-fixed d-flex justify-content-center align-items-center"
        style={{
          bottom: '20px',
          right: '20px',
          zIndex: 1050,
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          boxShadow: '0 0 8px 3px rgba(255, 193, 7, 0.7)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out',
        }}
        onClick={() => setCartOpen(true)}
        aria-label="Abrir carrinho"
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <FaShoppingCart size={28} color="#1e1e1e" />
        {totalQuantity > 0 && (
          <span
            className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill"
            style={{ fontSize: '0.7rem' }}
          >
            {totalQuantity}
          </span>
        )}
      </button>

      {/* Painel lateral do carrinho */}
      <div
        className="position-fixed top-0 end-0 bg-dark text-white shadow p-4"
        style={{
          width: '350px',
          height: '100%',
          zIndex: 1055,
          transition: 'transform 0.3s ease-in-out',
          transform: cartOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-warning m-0">Seu Carrinho</h4>
          <button
            className="btn-close btn-close-white"
            onClick={() => setCartOpen(false)}
            aria-label="Fechar carrinho"
          ></button>
        </div>
        <CartSideBar
          cartItems={cartItems}
          onRemoveFromCart={handleRemoveFromCart}
          onClose={() => setCartOpen(false)}
        />
      </div>
    </Router>
  );
}

export default App;
