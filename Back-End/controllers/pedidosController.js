        const Pedido = require('../models/Pedidos');

        exports.criarPedido = async (req, res, io) => {
        try {
            const pedidoData = req.body;

            const novoPedido = new Pedido({
            cliente: {
                nome: pedidoData.cliente.nome,
                endereco: {
                rua: pedidoData.cliente.endereco.rua,
                bairro: pedidoData.cliente.endereco.bairro,
                numero: pedidoData.cliente.endereco.numero,
                }
            },
            pagamento: {
                forma: pedidoData.pagamento.forma,
                troco: pedidoData.pagamento.troco || 0,
            },
            itens: pedidoData.itens,
            total: pedidoData.total,
            });

            const salvo = await novoPedido.save();

            io.emit('novoPedido', salvo);

            res.status(201).json(salvo);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao salvar pedido', error });
        }
        };

        exports.listarPedidos = async (req, res) => {
        try {
            const filtro = {};
            if (req.query.entregue === 'true') filtro.entregue = true;
            else if (req.query.entregue === 'false') filtro.entregue = false;

            const pedidos = await Pedido.find(filtro).sort({ criadoEm: -1 });
            res.json(pedidos);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar pedidos', error });
        }
        };

        exports.marcarEntregue = async (req, res) => {
    try {
        const { id } = req.params;

        const pedidoAtualizado = await Pedido.findByIdAndUpdate(
        id,
        { entregue: true },
        { new: true }
        );

        if (!pedidoAtualizado) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        // Emitir evento para todos clientes conectados informando o pedido entregue
        if (req.io) {
        req.io.emit('pedidoEntregue', pedidoAtualizado);
        }

        res.json(pedidoAtualizado);

    } catch (error) {
        console.error('Erro ao marcar pedido como entregue:', error);
        res.status(500).json({ message: 'Erro ao atualizar status', error: error.message });
    }
    };
