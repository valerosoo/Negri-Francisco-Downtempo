# Negri-Francisco-Downtempo

## Backend (MVC)

```bash
cd backend
npm install
npm start        # http://localhost:3000
```

### Endpoints - DJ

| Método | Ruta           | Descripción         |
|--------|----------------|---------------------|
| GET    | /api/djs       | Obtener todos       |
| GET    | /api/djs/:id   | Obtener por ID      |
| POST   | /api/djs       | Crear               |
| PUT    | /api/djs/:id   | Modificar           |
| DELETE | /api/djs/:id   | Eliminar            |

Body de POST/PUT:

```json
{
    "nombre": "Bonobo",
    "generoMusical": "Downtempo",
    "biografia": "Opcional",
    "cantidadLikes": 0
}
```

## Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

Requiere que el backend esté corriendo en `http://localhost:3000` (ver arriba) — la URL base de la API está en `frontend/src/services/api.js`.

### Organización

```
frontend/src/
├── assets/      # imágenes e íconos
├── components/  # componentes reutilizables (layout, home, explore, dj, ui)
├── pages/       # pantallas (HomePage)
├── services/    # toda la comunicación con la API (fetch centralizado)
├── context/     # ToastContext — sistema de notificaciones global
├── utils/       # validadores, hook useAsync, datos estáticos (horarios)
├── styles/      # variables, reset y estilos globales
├── App.jsx
└── main.jsx
```

### Alcance de esta entrega

El sitio es de una sola pantalla (según el boceto de Figma), con una sección
"Explorá Downtempo" dividida en 4 tabs:

- **DJ** — conectado en serio contra `/api/djs`: lista, alta, edición, borrado
  (con confirmación) y likes, todo con estados de carga y notificaciones de
  éxito/error.
- **Entrada, Menú y Rooftop** — reproducen el boceto con contenido de
  ejemplo, porque el backend de esta entrega todavía no expone esos recursos
  (`src/services/menuService.js` y `rooftopService.js` están armados para
  que el día que exista el endpoint real, solo cambie esa función).
