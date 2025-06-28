    import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { FaBars } from 'react-icons/fa';

    export default function Navbar() {
    const [showModal, setShowModal] = useState(false);
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false); // mensagem rápida após login
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('adminAuth');
        if (auth === 'true') {
        setIsAdmin(true);
        }
    }, []);

    function handleLogin(e) {
        e.preventDefault();

        if (nome === 'Maravilhasburguer2025' && senha === 'admin') {
        localStorage.setItem('adminAuth', 'true');
        setIsAdmin(true);
        setShowModal(false);
        setShowWelcome(true); // mostra mensagem
        setNome('');
        setSenha('');
        setTimeout(() => {
            setShowWelcome(false); // esconde após alguns segundos
        }, 4000);
        } else {
        alert('Credenciais inválidas');
        }
    }

    function handleLogout() {
        localStorage.removeItem('adminAuth');
        setIsAdmin(false);
        setShowModal(false);
        navigate('/');
    }

    return (
        <>
        <nav
            className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top"
            style={{ backgroundColor: '#1e1e1e' }}
        >
            <div className="container">
            <Link
                className="navbar-brand fw-bold text-warning"
                to="/"
                style={{ fontSize: '1.6rem', letterSpacing: '2px' }}
            >
                Maravilhas Burguer
            </Link>

            <button
                className="navbar-toggler border-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <FaBars color="white" size={22} />
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav align-items-center gap-3">
                <li className="nav-item">
                    <Link to="/" className="nav-link text-warning fw-semibold">
                    Home
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/cardapio" className="nav-link text-warning fw-semibold">
                    Cardápio
                    </Link>
                </li>

                {!isAdmin && (
                    <li className="nav-item">
                    <button
                        className="btn btn-sm btn-outline-warning"
                        style={{ fontSize: '0.8rem' }}
                        onClick={() => setShowModal(true)}
                    >
                        Admin
                    </button>
                    </li>
                )}

                {isAdmin && (
                    <>
                    <li
                        className="nav-item d-flex align-items-center text-warning"
                        style={{ fontSize: '0.9rem' }}
                    >
                        <span className="me-2">👤 Admin ativo</span>
                        <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={handleLogout}
                        title="Sair"
                        style={{ padding: '0.15rem 0.5rem' }}
                        >
                        ✕
                        </button>
                    </li>
                    <li className="nav-item">
                        <Link
                        to="/admin"
                        className="btn btn-sm btn-warning"
                        style={{ fontSize: '0.8rem' }}
                        >
                        Painel Admin
                        </Link>
                    </li>
                    </>
                )}
                </ul>
            </div>
            </div>
        </nav>

        {/* ✅ Mensagem de boas-vindas após login */}
        {showWelcome && (
            <div
            className="alert alert-warning text-dark text-center shadow"
            style={{
                position: 'fixed',
                top: '80px',
                right: '20px',
                zIndex: 9999,
                width: 'auto',
                animation: 'fadein 0.3s ease-in-out',
            }}
            >
            ✅ Você está conectado como admin. <br />
            Acesse o <strong>Painel Admin</strong> para gerenciar os pedidos!
            </div>
        )}

        {/* Modal de Login Admin */}
        {showModal && !isAdmin && (
            <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            onClick={() => setShowModal(false)}
            >
            <div
                className="modal-dialog modal-dialog-centered"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content bg-dark text-white border-warning">
                <div className="modal-header">
                    <h5 className="modal-title text-warning">Login Admin</h5>
                    <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                    ></button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Nome</label>
                        <input
                        type="text"
                        className="form-control"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        autoFocus
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Senha</label>
                        <input
                        type="password"
                        className="form-control"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        />
                    </div>
                    <button type="submit" className="btn btn-warning w-100">
                        Entrar
                    </button>
                    </form>
                </div>
                </div>
            </div>
            </div>
        )}
        </>
    );
    }
