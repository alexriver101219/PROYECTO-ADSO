# Proyecto SESHA — Breve guía

Este repositorio contiene páginas estáticas (landing, registro y login) y una hoja de estilos consolidada.

## Páginas principales
- `landing.html` — página pública / home.
- `register.html` — formulario de registro.
- `index.html` — login principal.
- `index1.html` — variante de login (usa Bootstrap).

## Hoja de estilos
- `style/stylesheet.css` — estilos consolidados para landing, registro y login.

## Bootstrap (CDN + SRI)
Todas las páginas usan Bootstrap 5.3.3 vía CDN con SRI para verificación.
- CSS (head):
  - URL: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css`
  - SRI: `sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH`
- JS bundle (antes de `</body>`):
  - URL: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js`
  - SRI: `sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz`

Las páginas cargan primero el CSS de Bootstrap y luego `style/stylesheet.css` para que tus estilos personalizados puedan sobreescribir las utilidades de Bootstrap cuando sea necesario.

## Cómo ver el sitio localmente
1. Abre cualquiera de los archivos HTML en tu navegador (por ejemplo `landing.html`).
   - En Windows: haz doble clic sobre el archivo o arrástralo al navegador.
2. Para una experiencia más cercana a producción (y evitar problemas de CORS al cargar assets), puedes servir la carpeta con un servidor local, por ejemplo usando Python:

```powershell
# desde la carpeta del proyecto
python -m http.server 8000
# luego abre http://localhost:8000/landing.html
```

## Qué cambié en esta sesión
- Limpieza y corrección de `index.html` e `index1.html` (fix HTML mal formado).
- Consolidación de CSS en `style/stylesheet.css`.
- Añadí Bootstrap 5.3.8 con SRI en `index1.html`, `index.html`, `landing.html` y `register.html`.
- Acomodé el CSS para evitar que el header fijo solape el contenido (`padding-top`) y armonicé `.btn-primary` con las variables de la UI.

## Cómo actualizar Bootstrap y el SRI
1. Busca la versión nueva en la página oficial: https://getbootstrap.com/docs/5.3/getting-started/introduction/
2. Actualiza las URLs en los archivos HTML (CSS y JS).
3. Reemplaza los valores del atributo `integrity` con los hashes SRI que publica Bootstrap para esa versión.
4. Verifica en el navegador y en consola de red que no haya errores de carga.

Nota: si actualizas a una versión mayor, revisa que ningún componente usado haya cambiado de API (p. ej. clases o comportamiento JS).

## Siguientes mejoras sugeridas
- Unificar todas las utilidades con clases de Bootstrap (container, row, col) para layout más consistente.
- Reemplazar rutas de imágenes en `assets/` por nombres consistentes (ej. `sesha-app.png`) y optimizarlas.
- Añadir tests visuales o una página de ejemplo con componentes de Bootstrap para validar estilos.

Si quieres, puedo:
- Convertir el formulario de `register.html` para usar grid de Bootstrap.
- Generar un pequeño archivo `bootstrap-overrides.css` con reglas más específicas.
- Crear un script o nota para automatizar la obtención del SRI cuando actualices la versión.

---
Generado el 25 de octubre de 2025.
