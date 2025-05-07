# Nexus Office – Frontend

Interfaz web desarrollada en Angular para la gestión y reserva de puestos de trabajo dentro de una oficina moderna. Pensada para empleados y administradores, incluyendo vista de plano interactivo, historial de reservas y estadísticas de asistencia.

---

## 🚀 Funcionalidades actuales

### 👤 Autenticación
- **Login y registro** con validación de campos.
- **Gestión de tokens JWT**.
- Modo de login con formulario doble (login y registro en la misma vista).
- **Logout** con snackbar de confirmación.

### 🗺️ Panel de usuario
- Vista de plano interactivo de la oficina con asignación de puestos.
- Modo **lista** alternativa al grid visual.
- Reserva o cancelación de puesto según disponibilidad.
- **Botón flotante** contextual que cambia entre reservar / cancelar según el estado.
- Vista responsive adaptada a dispositivos móviles.
- Gestión visual de asientos ocupados, libres, o del propio usuario.

### 📅 Calendario
- Vista de calendario mensual con días reservados destacados.
- Días con reservas pasadas o futuras diferenciados por color.
- Posibilidad de navegar entre meses y ver estadísticas del mes:
  - Asistencias realizadas.
  - Reservas futuras.
  - Total de reservas.
- Vista adaptada para móviles (etiquetas abreviadas, colores y diseño compactado).
- Selección de días que redirige al panel con la fecha filtrada.

### 🔍 Búsqueda y administración
- Los **administradores** pueden:
  - Buscar cualquier usuario desde el calendario.
  - Ver su historial de asistencias.
  - Editar plano de asientos (agregar, eliminar, modificar puestos).
  - Cambiar entre modos de edición y visualización.

### 🌐 PWA – Progressive Web App
- Aplicación instalable en dispositivos móviles y escritorio.
- Soporte para notificaciones con snackbar personalizado.
- Soporte offline y caching mediante Service Worker.
- Manifest configurado con icono optimizado y fondo adaptable.

### 👤 Perfil
- Página de perfil con información básica del usuario autenticado (nombre, email, rol).
- Botón de cierre de sesión.

---

## 🧩 Tecnologías utilizadas

- **Angular 19** con Standalone Components
- **Angular Material**
- **RxJS**
- **Date-fns**
- **Angular Calendar**
- **PWA Support**
- **SCSS modular y responsive**

---

## 📦 Estructura general

src/
├── app/
│ ├── pages/ (user-panel, calendar, login, profile)
│ ├── components/ (snackbar, sidebar, etc.)
│ ├── services/
│ ├── core/ (auth, guards)
│ ├── layout/
│ └── shared/


---

## 🔮 Posibles mejoras futuras

- Notificaciones push para recordar reservas.
- Reserva recurrente (por ejemplo: todos los martes del mes).
- Filtro de puestos por características (pantalla, cerca de ventana, etc).
- Estadísticas globales por usuario (historial completo, ranking de asistencia).
- Gestión de usuarios (creación, roles, etc) desde el frontend.
- Modo oscuro y personalización visual.
- Exportación de calendario (ICS/Google Calendar).
- Integración con QR para check-in presencial.

---

## 👨‍💻 Contribución

¿Quieres colaborar? Abre un pull request o crea una issue con tus sugerencias.

---

## 📜 Licencia

MIT © 2025 – Juan Manuel Canó Serrano

