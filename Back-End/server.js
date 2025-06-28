    require('dotenv').config();
    const express = require('express');
    const cors = require('cors');
    const http = require('http');
    const { Server } = require('socket.io');
    const connectDB = require('./config/db');

    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
    cors: {
        origin: '*', // Ajuste para seu front-end na produção
        methods: ['GET', 'POST', 'PUT'],
    },
    });

    const PORT = process.env.PORT || 5000;
    const MONGO_URI = process.env.MONGO_URI;

    // Importa o model Pedido
    const Pedido = require('./models/Pedidos');

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Conectar ao MongoDB
    connectDB(MONGO_URI);

    // Importar rotas (passando io para rotas que precisam emitir eventos)
    const pedidos = require('./routes/pedidos')(io);
    const adminRoutes = require('./routes/Admin');

    app.use('/pedidos', pedidos);
    app.use('/', adminRoutes);

    app.get('/', (req, res) => {
    res.send('API Burguer Rodando!');
    });

    // Inicializar eventos do Socket.IO em módulo separado
    require('./socket/pedidosSocket')(io);

    // Função para remover pedidos entregues há mais de 5 horas
    const removerPedidosAntigos = async () => {
    const cincoHorasAtras = new Date(Date.now() - 5 * 60 * 60 * 1000);
    try {
        const resultado = await Pedido.deleteMany({
        entregue: true,
        criadoEm: { $lte: cincoHorasAtras },
        });
        if (resultado.deletedCount > 0) {
        console.log(`Pedidos entregues removidos: ${resultado.deletedCount}`);
        }
    } catch (err) {
        console.error('Erro ao remover pedidos entregues antigos:', err);
    }
    };

    // Roda a cada 1 hora (3600000 ms)
    setInterval(removerPedidosAntigos, 3600000);

    // Inicia o servidor
    server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    });
