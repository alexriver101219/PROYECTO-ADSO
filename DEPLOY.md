# 🚀 SESHA - Deployment Guide

## Requisitos Previos

- Node.js 16+ 
- MongoDB Atlas (cloud) o MongoDB local
- Vercel account (frontend)
- Railway o Heroku account (backend)

---

## 1️⃣ Configurar Variables de Entorno

### Backend (.env en raíz)
```bash
PORT=3000
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/sesha
JWT_SECRET=tu-secreto-muy-seguro-aqui
NODE_ENV=production
```

### Frontend (.env.local en client/)
```bash
VITE_API_URL=https://tu-backend.railway.app
```

---

## 2️⃣ Deploy Frontend (Vercel)

1. **Conectar repositorio GitHub:**
   ```bash
   git push origin main
   ```

2. **En Vercel Dashboard:**
   - New Project → Importar `PROYECTO-ADSO`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Deploy ✓

3. **URL resultado:** `https://tu-app.vercel.app`

---

## 3️⃣ Deploy Backend (Railway)

1. **Crear proyecto en Railway:**
   - Conectar GitHub
   - Elegir repositorio

2. **Variables de entorno en Railway:**
   - `MONGODB_URI` → Tu connection string de MongoDB Atlas
   - `JWT_SECRET` → Tu secreto seguro
   - `PORT` → `3000` (Railway asigna automáticamente)
   - `NODE_ENV` → `production`

3. **Deploy automático** cuando hagas push a `main` ✓

4. **URL resultado:** `https://tu-backend.railway.app`

---

## 4️⃣ Actualizar Frontend con URL Backend

En `client/.env.local`:
```bash
VITE_API_URL=https://tu-backend.railway.app
```

Actualizar `client/src/AuthContext.jsx`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const response = await axios.post(`${API_URL}/login`, { email, password });
```

---

## 5️⃣ Pruebas en Producción

1. Abrir `https://tu-app.vercel.app`
2. Registrarse
3. Login
4. Dashboard (solo admin)
5. Verificar que los datos se guardan en MongoDB

---

## 📋 Checklist Final

- [ ] MongoDB Atlas configurado
- [ ] JWT_SECRET actualizado (seguro)
- [ ] Frontend deployado en Vercel
- [ ] Backend deployado en Railway
- [ ] Variables de entorno sincronizadas
- [ ] Tests en producción exitosos
- [ ] Dominio personalizado (opcional)

---

## 🆘 Troubleshooting

**Error: "Cannot connect to MongoDB"**
- Verificar IP whitelist en MongoDB Atlas
- Asegurarse que MONGODB_URI es correcto

**Error: "CORS error"**
- Agregar `Access-Control-Allow-Origin` en server.js
- En Azure/Railway: verificar que el backend está corriendo

**Error: "Token inválido"**
- Verificar que JWT_SECRET es igual en todas partes
- Limpiar localStorage del navegador

---

¡Listo! Tu app está en producción. 🎉
