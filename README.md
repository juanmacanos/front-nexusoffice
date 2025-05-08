# Nexus Office – Frontend

Interfaz de usuario desarrollada en Angular para la gestión de reservas de puestos de trabajo en oficinas. Optimizada para móvil, escritorio y Progressive Web App (PWA).

🔗 Repositorio backend complementario: [back-nexusoffice](https://github.com/juanmacanos/back-nexusoffice)

---

## ⚙️ Funcionalidades Implementadas

### 🔐 Autenticación
- Inicio de sesión y registro con validación de formularios.
- Uso de **JWT** para autenticar peticiones al backend.
- Gestión de sesión con `Authorization: Bearer` en cabeceras HTTP.
- Visual feedback con `SnackbarComponent` para errores y acciones exitosas.

### 🖥️ Panel de usuario
- Plano editable y responsivo con asignación visual de puestos (`grid` o `list view`).
- Botón flotante de acción contextual para reservar o cancelar.
- Deep linking con calendar por fecha vía `queryParams`.
- Vista especial para **administradores**:
  - Añadir, editar o eliminar puestos de trabajo directamente desde el plano.
  - Cambiar vista y editar disposición en tiempo real.

### 📆 Calendario
- Vista mensual y semanal con integración de eventos (reservas).
- Estadísticas mensuales: asistencias realizadas, reservas futuras y totales.
- Resaltado visual de días según tipo de reserva y estado.
- Redirección al día seleccionado para realizar reservas directamente.

### 🔍 Gestión de usuarios (Admin)
- Selector para ver el calendario de cualquier usuario.
- Filtro por nombre con opción para volver a visualizar el propio historial.

### 📱 Progressive Web App (PWA)
- Instalación desde Android o escritorio.
- Cacheo offline y soporte con `serviceWorker`.
- `manifest.webmanifest` personalizado con logo adaptado para distintos entornos.

### 👤 Perfil
- Visualización de nombre, email y rol del usuario logeado.
- Logout funcional con feedback.

---

## 🧠 Aspectos técnicos

- Angular v19 (standalone components, signals ready).
- Angular Material con theming y responsive design.
- Calendar personalizado (angular-calendar).
- Arquitectura modular (pages, components, services, core, layout).
- Sistema visual adaptado con `BreakPointObserver`.
- SCSS estructurado con mobile-first.
- Uso de `MatSnackBar` para notificaciones centralizadas.

---

## 🛠️ Posibles mejoras técnicas

- 🌙 Modo oscuro configurable por usuario.
- 🗓️ Exportación a Google Calendar / ICS.
- 📈 Dashboard de estadísticas globales por departamento o usuario.
- 🧩 Mejor estructuración por componentes: dividir vistas como `calendar` o `user-panel` en subcomponentes (`calendar-header`, `stat-card`, `user-selector`, etc.).
- 🧠 Separación de lógica de presentación: delegar cálculos y lógica compleja a servicios dedicados.
- 🔐 Persistencia del token más segura: uso de cookies HttpOnly en vez de `localStorage`. Esto es competencia del backend realmente, pero debería de dejar de guardarse en localStorage actualmente en el frontend, para evitar ataques XSS.
- 📧 Confirmación de cuenta por email al registrarse. Competencia del backend, pero la implicación del frontend es crear la vista para confirmar la cuenta.
- ✉️ Sistema de notificaciones por email para reservas, recordatorios o cambios.
- ⚙️ Manejo global de errores y estados de carga con interceptores y servicios compartidos.
- 📲 Soporte PWA más completo: caché offline, actualización automática y fallback en ausencia de red.
- ♿ Mejoras de accesibilidad: navegación por teclado, etiquetas ARIA y contraste correcto.


---

## ▶️ Scripts útiles

```bash
npm install     # Instalación de dependencias
npm start       # Servidor local en modo desarrollo
npm run build   # Compilación producción (PWA incluida)
```
---

📄 Licencia
MIT © 2025 – Juanma Canó


