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

El sitio es de una sola pantalla pensada para **vender entradas** a las noches
con DJs. Orden de prioridades de la página:

1. **Hero** — la próxima fecha con line-up, precio y botón "Comprar entradas".
2. **Cartelera** — todas las fechas futuras con DJs, cupo restante y compra.
3. **DJs** — listado con likes y alta/edición/baja (`/api/djs`).
4. **Menú y Rooftop** — apoyo para conocer el lugar (`/api/menu`).

La compra es **simulada** (no hay cobro): un modal pide cantidad, nombre y
email, el backend descuenta el cupo y devuelve una entrada con código por cada
lugar (`DT-XXXXXX`).

## Endpoints nuevos del backend

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/eventos` | Cartelera ordenada por fecha, con los DJs de cada evento |
| GET | `/api/eventos/:id` | Un evento |
| POST / PUT / DELETE | `/api/eventos[/:id]` | Alta, edición y baja (no se borra si ya vendió entradas) |
| POST | `/api/reservas` | Compra: `{ idEvento, cantidadEntradas (1-6), nombre, email }` |
| GET | `/api/reservas/:id` | Detalle de una compra con sus entradas |
| GET | `/api/menu` | Ítems del menú |

Los datos viven en memoria: al reiniciar el backend vuelven a los de ejemplo
(las fechas de la cartelera se generan relativas a hoy).
