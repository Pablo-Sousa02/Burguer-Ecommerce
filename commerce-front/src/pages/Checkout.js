    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';

    export default function Checkout({ cartItems = [] }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nome: '',
        rua: '',
        bairro: '',
        numero: '',
        pagamento: 'cartao',
        troco: '',
    });
    const [success, setSuccess] = useState(false);

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess(true);
        setTimeout(() => navigate('/'), 3000);
    };

    return (
        <div className="container py-5">
        <div className="row g-4">
            <div className="col-md-6">
            <div className="card bg-dark text-white shadow-lg border-warning">
                <div className="card-header text-warning fs-4">Resumo do Pedido</div>
                <div className="card-body">
                {cartItems.length === 0 ? (
                    <p>Seu carrinho está vazio.</p>
                ) : (
                    <ul className="list-group">
                    {cartItems.map((item) => (
                        <li
                        key={item.id}
                        className="list-group-item bg-dark text-white d-flex justify-content-between border-warning"
                        >
                        <span>{item.name} x {item.quantity}</span>
                        <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                    </ul>
                )}
                <h5 className="text-end mt-3">Total: <span className="text-warning">R$ {total.toFixed(2)}</span></h5>
                </div>
            </div>
            </div>

            <div className="col-md-6">
            <div className="card bg-dark text-white shadow-lg border-warning">
                <div className="card-header text-warning fs-4">
                {step === 1 ? 'Dados do Cliente' : 'Pagamento'}
                </div>
                <div className="card-body">
                {success ? (
                    <div className="alert alert-success text-center">
                    Pedido realizado com sucesso!
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <>
                        <div className="mb-3">
                            <label className="form-label">Nome</label>
                            <input
                            type="text"
                            className="form-control"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                            />
                        </div>
                        <div className="row g-2">
                            <div className="col-md-6">
                            <label className="form-label">Rua</label>
                            <input
                                type="text"
                                className="form-control"
                                name="rua"
                                value={formData.rua}
                                onChange={handleChange}
                                required
                            />
                            </div>
                            <div className="col-md-6">
                            <label className="form-label">Bairro</label>
                            <input
                                type="text"
                                className="form-control"
                                name="bairro"
                                value={formData.bairro}
                                onChange={handleChange}
                                required
                            />
                            </div>
                        </div>
                        <div className="mt-3">
                            <label className="form-label">Número</label>
                            <input
                            type="text"
                            className="form-control"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                            required
                            />
                        </div>
                        <div className="d-flex justify-content-end mt-4">
                            <button
                            type="button"
                            className="btn btn-warning fw-bold"
                            onClick={nextStep}
                            >
                            Próximo
                            </button>
                        </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                        <div className="mb-3">
                            <label className="form-label">Forma de Pagamento</label>
                            <select
                            className="form-select"
                            name="pagamento"
                            value={formData.pagamento}
                            onChange={handleChange}
                            >
                            <option value="cartao">Cartão de Crédito</option>
                            <option value="pix">PIX</option>
                            <option value="dinheiro">Dinheiro</option>
                            </select>
                        </div>

                        {formData.pagamento === 'dinheiro' && (
                            <div className="mb-3">
                            <label className="form-label">Troco para quanto?</label>
                            <input
                                type="text"
                                className="form-control"
                                name="troco"
                                value={formData.troco}
                                onChange={handleChange}
                            />
                            </div>
                        )}

                        <div className="d-flex justify-content-between">
                            <button
                            type="button"
                            className="btn btn-outline-light"
                            onClick={prevStep}
                            >
                            Voltar
                            </button>
                            <button
                            type="submit"
                            className="btn btn-warning fw-bold"
                            >
                            Finalizar Pedido
                            </button>
                        </div>
                        </>
                    )}
                    </form>
                )}
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    }
