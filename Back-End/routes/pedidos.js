        // routes/pedidos.js
        const express = require('express');
        const router = express.Router();
        const pedidosController = require('../controllers/pedidosController');

        module.exports = (io) => {
        router.post('/', (req, res) => pedidosController.criarPedido(req, res, io));
        router.get('/', pedidosController.listarPedidos);
        router.put('/:id/entregue', (req, res) =>
        pedidosController.marcarEntregue({ ...req, io }, res)
    );
    return router;
    };
