    require('dotenv').config();
    const express = require('express');
    const cors = require('cors');
    const http = require('http');
    const { Server } = require('socket.io');
    const connectDB = require('./config/db');
    const webpush = require('web-push');

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

    // Configurar VAPID do web-push (chaves no .env)
    webpush.setVapidDetails(
    'mailto:pablooficial22@hotmail.com', // <-- substitua pelo seu email real
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
    );

    // Array temporário para armazenar subscriptions
    const subscriptions = [];

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Conectar ao MongoDB
    connectDB(MONGO_URI);

    // Importar rotas (passando io para rotas que precisam emitir eventos)
    const pedidosRoutes = require('./routes/pedidos')(io);
    const adminRoutes = require('./routes/Admin');

    app.use('/pedidos', pedidosRoutes);
    app.use('/', adminRoutes);

    // Endpoint para salvar subscription do push
    app.post('/save-subscription', (req, res) => {
    const subscription = req.body;

    // Evitar duplicação
    const exists = subscriptions.find(
        (sub) => JSON.stringify(sub) === JSON.stringify(subscription)
    );
    if (!exists) subscriptions.push(subscription);

    console.log('Subscription salva:', subscription);

    res.status(201).json({ message: 'Subscription salva com sucesso' });
    });

    // Endpoint para criar pedido com notificação push
    app.post('/pedidos', async (req, res) => {
    const novoPedido = req.body;

    try {
        // Salvar no banco
        const pedidoCriado = await Pedido.create(novoPedido);

        // Emitir evento socket para front-end
        io.emit('novoPedido', pedidoCriado);

        // Payload da notificação push
        const payload = JSON.stringify({
  title: 'Novo Pedido!',
  message: `Pedido de ${pedidoCriado.cliente?.nome || 'Cliente'} recebido.`,
  icon: '/icons/icon-192.png',
  url: '/admin'
});


        // Enviar notificação para todas as subscriptions
        subscriptions.forEach((sub) => {
        webpush.sendNotification(sub, payload).catch((err) => {
            console.error('Erro ao enviar notificação push:', err);
        });
        });

        res.status(201).json(pedidoCriado);
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        res.status(500).json({ error: 'Erro ao criar pedido' });
    }
    });

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
    setInterval(removerPedidosAntigos, 18000);

    // Inicia o servidor
    server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    });
