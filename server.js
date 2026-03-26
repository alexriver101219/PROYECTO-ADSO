const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Esta es la ruta que definiste en tu fetch('/register')
app.post('/register', (req, res) => {
    const { fullname, email, password, role } = req.body;

    // Aquí normalmente validarías y guardarías en una base de datos (como MongoDB o PostgreSQL)
    console.log(`Nuevo registro: ${fullname} - ${email}`);

    // Respuesta que espera tu código JS del frontend
    if (email && password) {
        res.json({ success: true, message: "Usuario creado con éxito" });
    } else {
        res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Aquí normalmente validarías contra la base de datos
    console.log(`Intento de login: ${email}`);

    if (email === 'admin@example.com' && password === 'password123') {
        return res.json({ success: true, message: 'Login exitoso' });
    }

    if (email && password) {
        return res.json({ success: true, message: 'Login simulado exitoso' });
    }

    res.status(401).json({ success: false, message: 'Credenciales inválidas' });
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));