# Instrucciones para Copilot

## Arquitectura
- Aplicación full-stack con frontend React (Vite) y backend Node.js/Express + MongoDB
- Autenticación JWT con roles (admin/user)
- Comunicación API vía Axios, proxy en desarrollo para evitar CORS
- Ver DEPLOY.md para detalles de arquitectura y despliegue

## Build and Test
- Instalar dependencias: `npm install` en raíz y `client/`
- Desarrollo: `npm run dev` (corre backend y frontend simultáneamente)
- Build producción: `npm run build` (cliente optimizado)
- No hay framework de tests configurado

## Convenciones
- Componentes React en PascalCase, archivos descriptivos
- Estado global con Context API (AuthContext)
- Passwords hasheadas con bcrypt en Mongoose pre-save hooks
- ESLint configurado para React, ver client/eslint.config.js

## Estilo de Código
- React moderno con hooks y componentes funcionales
- Axios para llamadas API con headers de autorización
- Manejo básico de errores, logging en consola
- CSS con clases BEM-like en componentes