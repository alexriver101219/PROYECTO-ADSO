const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Conectar a MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✓ Conectado a MongoDB'))
  .catch((err) => console.log('✗ Error MongoDB:', err.message));

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

// Registro
app.post('/register', async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ success: false, message: 'Faltan datos obligatorios' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email ya registrado' });
    }

    const user = new User({ fullname, email, password, role });
    await user.save();

    const token = jwt.sign({ 
      id: user._id, 
      email: user.email, 
      fullname: user.fullname, 
      role: user.role 
    }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      success: true, 
      message: "Usuario creado con éxito",
      token,
      user: { email: user.email, fullname: user.fullname, role: user.role }
    });
  } catch (err) {
    console.error('Error registro:', err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y contraseña requeridos' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ 
      id: user._id, 
      email: user.email, 
      fullname: user.fullname, 
      role: user.role 
    }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      success: true, 
      message: 'Login exitoso',
      token,
      user: { email: user.email, fullname: user.fullname, role: user.role }
    });
  } catch (err) {
    console.error('Error login:', err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Obtener perfil
app.get('/api/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al obtener perfil' });
  }
});

// Obtener todos los usuarios (admin)
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Acceso denegado' });
    }
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
  }
});

app.listen(PORT, () => console.log(`✓ Servidor corriendo en http://localhost:${PORT}`));