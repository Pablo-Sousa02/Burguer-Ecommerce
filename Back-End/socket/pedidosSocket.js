    // socket/pedidosSocket.js
    const Pedidos = require('../models/Pedidos'); // ou '../models/Pedido' dependendo do nome real do arquivo

    module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log('Novo cliente conectado:', socket.id);

        // Evento: Enviar pedidos
        socket.on('getPedidos', async () => {
        const pedidos = await Pedidos.find({ entregue: false }).sort({ criadoEm: -1 });
        socket.emit('pedidosAtualizados', pedidos);
        });

        // Evento: Marcar pedido como entregue
        socket.on('marcarEntregue', async (pedidoId) => {
    const atualizado = await Pedidos.findByIdAndUpdate(
        pedidoId,
        { entregue: true },
        { new: true }
    );

    const pedidos = await Pedidos.find({ entregue: false }).sort({ criadoEm: -1 });
    const entregues = await Pedidos.find({ entregue: true });

    const vendasPorPagamento = {
        cartao: 0,
        pix: 0,
        dinheiro: 0,
    };

    const TAXA_ENTREGA = 2;

    let totalEntregues = entregues.length;

    entregues.forEach((pedido) => {
        const forma = pedido.pagamento.forma;
        const valor = (pedido.total || 0) + TAXA_ENTREGA;

        if (forma && vendasPorPagamento[forma] !== undefined) {
            vendasPorPagamento[forma] += valor;
        }
    });

    io.emit('pedidosAtualizados', pedidos);
    io.emit('dashboardAtualizado', {
        totalEntregues,
        vendasPorPagamento,
    });
});

        socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        });
    });
    };
