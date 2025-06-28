    const mongoose = require('mongoose');

    const pedidoSchema = new mongoose.Schema({
    cliente: {
        nome: { type: String, required: true },
        endereco: {
        rua: String,
        bairro: String,
        numero: String,
        }
    },
    pagamento: {
        forma: String,
        troco: Number,
    },
    itens: [
        {
        name: String,
        quantity: Number,
        price: Number,
        image: String,
        molhosOpcionais: [String], // ← agora será salvo no banco
        }
    ],
    total: Number,
    entregue: { type: Boolean, default: false },
    criadoEm: { type: Date, default: Date.now }
    });

    module.exports = mongoose.model('Pedidos', pedidoSchema);
