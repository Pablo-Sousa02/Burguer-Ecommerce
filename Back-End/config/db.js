    const mongoose = require('mongoose');

    const connectDB = async (MONGO_URI) => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB conectado com sucesso');
    } catch (error) {
        console.error('Erro ao conectar no MongoDB:', error);
        process.exit(1); // Encerra app se não conectar
    }
    };

    module.exports = connectDB;
