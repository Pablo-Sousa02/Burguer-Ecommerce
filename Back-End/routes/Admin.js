    const express = require('express');
    const router = express.Router();

    // Login admin hardcoded
    router.post('/admin/login', (req, res) => {
    const { nome, senha } = req.body;

    if (nome === 'Maravilhasburguer2025' && senha === 'admin') {
        // Aqui, idealmente, você geraria um token JWT
        return res.json({ sucesso: true, token: 'tokenFake123' });
    }

    return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
    });

    module.exports = router;
