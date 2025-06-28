            import React, { useState } from 'react';
            import { useNavigate } from 'react-router-dom';
            import 'animate.css';

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
            const [errors, setErrors] = useState({});
            const [success, setSuccess] = useState(false);

            const total = cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            const handleChange = (e) => {
                setFormData({ ...formData, [e.target.name]: e.target.value });
                setErrors({ ...errors, [e.target.name]: '' }); // limpa erro do campo editado
            };

            const validateStep1 = () => {
                const newErrors = {};
                if (!formData.nome.trim()) newErrors.nome = 'Preencha o nome.';
                if (!formData.rua.trim()) newErrors.rua = 'Preencha a rua.';
                if (!formData.bairro.trim()) newErrors.bairro = 'Preencha o bairro.';
                if (!formData.numero.trim()) newErrors.numero = 'Preencha o número.';
                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
            };

            const validateStep2 = () => {
                if (formData.pagamento === 'dinheiro' && !formData.troco.trim()) {
                setErrors({ troco: 'Informe o valor do troco.' });
                return false;
                }
                return true;
            };

            const nextStep = () => {
                if (validateStep1()) setStep(2);
            };

            const prevStep = () => setStep(1);

            const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const pedido = {
        cliente: {
        nome: formData.nome,
        endereco: {
            rua: formData.rua,
            bairro: formData.bairro,
            numero: formData.numero,
        },
        },
        pagamento: {
        forma: formData.pagamento,
        troco: formData.troco ? parseFloat(formData.troco) : 0,
        },
        itens: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        molhosOpcionais: item.molhosOpcionais || []
        })),
        total,
        criadoEm: new Date()
    };

    try {
        const res = await fetch('http://localhost:5000/pedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
        });

        if (!res.ok) {
        throw new Error('Erro ao salvar pedido');
        }

        setSuccess(true);
        setTimeout(() => navigate('/'), 3000);
    } catch (error) {
        alert('Erro ao enviar pedido, tente novamente.');
        console.error(error);
    }
    };


            return (
                <div className="container py-5">
                <div className="row g-4">

                    {/* COLUNA 1 - Resumo */}
                    <div className="col-md-6">
                    <div className="card bg-dark text-white shadow border-warning animate__animated animate__fadeInLeft">
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
                        <h5 className="text-end mt-3">
                            Total: <span className="text-warning">R$ {total.toFixed(2)}</span>
                        </h5>
                        </div>
                    </div>
                    </div>

                    {/* COLUNA 2 - Formulário */}
                    <div className="col-md-6">
                    <div className="card bg-dark text-white shadow border-warning animate__animated animate__fadeInRight">
                        <div className="card-header text-warning fs-4">
                        {step === 1 ? 'Dados do Cliente' : 'Forma de Pagamento'}
                        </div>
                        <div className="card-body">
                        {success ? (
                            <div className="alert alert-success text-center animate__animated animate__fadeInDown">
                            🎉 Pedido realizado com sucesso! Redirecionando...
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>

                            {/* Barra de etapas com ícones */}
                            <div className="d-flex justify-content-around mb-4 animate__animated animate__fadeInDown">
                                <div className="text-center">
                                <div
                                    className={`rounded-circle border ${
                                    step === 1
                                        ? 'bg-warning text-dark fw-bold'
                                        : 'bg-secondary text-white'
                                    } d-flex align-items-center justify-content-center`}
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    1
                                </div>
                                <small className="mt-1 d-block">Cliente</small>
                                </div>

                                <div className="text-center">
                                <div
                                    className={`rounded-circle border ${
                                    step === 2
                                        ? 'bg-warning text-dark fw-bold'
                                        : 'bg-secondary text-white'
                                    } d-flex align-items-center justify-content-center`}
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    2
                                </div>
                                <small className="mt-1 d-block">Pagamento</small>
                                </div>
                            </div>

                            {/* Etapa 1 */}
                            {step === 1 && (
                                <div className="animate__animated animate__fadeIn">
                                <div className="mb-3">
                                    <label className="form-label">Nome</label>
                                    <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                                    />
                                    {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                                </div>

                                <div className="row g-2">
                                    <div className="col-md-6">
                                    <label className="form-label">Rua</label>
                                    <input
                                        type="text"
                                        name="rua"
                                        value={formData.rua}
                                        onChange={handleChange}
                                        className={`form-control ${errors.rua ? 'is-invalid' : ''}`}
                                    />
                                    {errors.rua && <div className="invalid-feedback">{errors.rua}</div>}
                                    </div>
                                    <div className="col-md-6">
                                    <label className="form-label">Bairro</label>
                                    <input
                                        type="text"
                                        name="bairro"
                                        value={formData.bairro}
                                        onChange={handleChange}
                                        className={`form-control ${errors.bairro ? 'is-invalid' : ''}`}
                                    />
                                    {errors.bairro && <div className="invalid-feedback">{errors.bairro}</div>}
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <label className="form-label">Número</label>
                                    <input
                                    type="text"
                                    name="numero"
                                    value={formData.numero}
                                    onChange={handleChange}
                                    className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
                                    />
                                    {errors.numero && <div className="invalid-feedback">{errors.numero}</div>}
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
                                </div>
                            )}

                            {/* Etapa 2 */}
                            {step === 2 && (
                                <div className="animate__animated animate__fadeIn">
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
                                        name="troco"
                                        value={formData.troco}
                                        onChange={handleChange}
                                        className={`form-control ${errors.troco ? 'is-invalid' : ''}`}
                                    />
                                    {errors.troco && <div className="invalid-feedback">{errors.troco}</div>}
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
                                </div>
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
