# Instrucciones para Copilot

## Arquitectura del Proyecto
- El proyecto está estructurado en archivos HTML y CSS, donde cada archivo HTML representa una página específica (por ejemplo, `index.html` para el inicio de sesión y `register.html` para el registro).
- Los estilos se gestionan a través de `stylesheet.css`, que define la apariencia de los elementos en las páginas.

## Flujos de Trabajo
- Las páginas HTML incluyen formularios que utilizan validación básica en el lado del cliente. Por ejemplo, en `register.html`, se verifica que las contraseñas coincidan y que todos los campos requeridos estén completos antes de enviar el formulario.
- Se puede implementar una llamada a la API para enviar datos del formulario al servidor, como se indica en el script de `register.html`.

## Convenciones
- Los nombres de los archivos deben ser descriptivos y reflejar su contenido (por ejemplo, `register.html` para la página de registro).
- Se recomienda mantener un estilo de codificación consistente en HTML y CSS, utilizando comentarios para secciones importantes del código.

## Puntos de Integración
- El formulario de registro en `register.html` está diseñado para integrarse con un backend a través de una llamada `fetch` que se puede descomentar y ajustar según sea necesario.
- Se debe considerar la implementación de un sistema de gestión de errores para mejorar la experiencia del usuario.