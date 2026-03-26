const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const JWT_SECRET = 'tu-secreto-muy-seguro-cambiar-en-produccion';

// Middleware para verificar JWT
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ success: false, message: 'Token inválido' });
        req.user = decoded;
        next();
    });
}

app.post('/register', (req, res) => {
    const { fullname, email, password, role } = req.body;

    console.log(`Nuevo registro: ${fullname} - ${email}`);

    if (email && password && fullname) {
        const token = jwt.sign({ email, fullname, role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ 
            success: true, 
            message: "Usuario creado con éxito",
            token,
            user: { email, fullname, role }
        });
    } else {
        res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log(`Intento de login: ${email}`);

    if (email && password) {
        const token = jwt.sign({ email, fullname: 'Usuario', role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ 
            success: true, 
            message: 'Login exitoso',
            token,
            user: { email, fullname: 'Usuario', role: 'user' }
        });
    }

    res.status(401).json({ success: false, message: 'Credenciales inválidas' });
});

app.get('/api/profile', verifyToken, (req, res) => {
    res.json({ success: true, user: req.user });
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));