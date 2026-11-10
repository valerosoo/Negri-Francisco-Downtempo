# Negri-Francisco-Downtempo

Sitio de **Downtempo**, un rooftop bar con música electrónica: cartelera de
fechas, compra de entradas con código QR, DJs con playlists, menú y un panel
de administración.

- **Backend:** Node + Express, patrón MVC, datos en un archivo JSON.
- **Frontend:** React + Vite + React Router.

El modelo de clases está en [`ModeloClases.png`](ModeloClases.png).

## Cómo levantarlo

Se necesitan dos terminales (Node 22 o superior).

```bash
# 1) Backend → http://localhost:3000
cd backend
npm install
npm run dev

# 2) Frontend → http://localhost:5173
cd frontend
npm install
npm run dev
```

| Comando (en `backend/`) | Qué hace |
| --- | --- |
| `npm run dev` | Levanta la API y se reinicia sola al guardar cambios |
| `npm start` | Levanta la API sin recarga |
| `npm test` | Corre los tests (servicios + API de punta a punta) |
| `npm run seed` | Borra los datos y vuelve a los de ejemplo, con la cartelera a partir de hoy |

| Comando (en `frontend/`) | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila a `dist/` |
| `npm run lint` | Linter (oxlint) |

### Configuración (opcional)

Todo funciona sin configurar nada. Para cambiar los valores por defecto, copiá
el `.env.example` de cada carpeta como `.env`:

| Variable | Dónde | Por defecto | Para qué |
| --- | --- | --- | --- |
| `PORT` | backend | `3000` | Puerto de la API |
| `DB_FILE` | backend | `data/db.json` | Archivo donde se guardan los datos |
| `ADMIN_KEY` | backend | `downtempo-admin` | Clave del panel de administración |
| `CORS_ORIGIN` | backend | `*` | Origen permitido por CORS |
| `VITE_API_URL` | frontend | `http://localhost:3000/api` | URL de la API |

## Qué se puede hacer en el sitio

| Pantalla | Ruta | Contenido |
| --- | --- | --- |
| Inicio | `/` | Próxima fecha, cartelera con filtros, DJs, menú y galería del rooftop |
| Detalle de evento | `/eventos/:id` | Descripción, line-up, horarios, cupo, mapa y compra |
| Mis entradas | `/mis-entradas` | Reservas por email, con el QR de cada entrada y la opción de cancelar |
| Administración | `/admin` | Alta, edición y baja de fechas, DJs y menú; control de puerta y ventas |

- **Compra de entradas (simulada, sin cobro):** se elige la cantidad (hasta 6),
  nombre y email. El backend descuenta el cupo y genera un código `DT-XXXXXX`
  por entrada, que se muestra con su QR. Opcionalmente se puede dejar
  encargado un pedido del menú, que se suma al total.
- **Mis entradas:** el cliente se identifica con el email de la compra (no hay
  contraseña). Cancelar devuelve las entradas al cupo del evento.
- **Cartelera:** filtros por período, género y DJ, y "solo con entradas". Cada
  fecha muestra cuántas entradas quedan.
- **DJs:** likes, ficha con playlists (cada tema abre una búsqueda en Spotify),
  DJs parecidos y recomendación de temas para el DJ. El formulario "¿Sos DJ?"
  da de alta un DJ nuevo.
- **Menú:** pestañas por categoría y buscador.
- **Administración:** se entra desde el link del pie de página con la clave
  `ADMIN_KEY`. En "Entradas y ventas" se valida un código en la puerta (cada
  entrada sirve una sola vez) y se ven todas las reservas.

### Datos de ejemplo que conviene reemplazar

- **Ubicación:** la dirección y las coordenadas del mapa son de ejemplo. Se
  cambian en `frontend/src/utils/venue.js`.
- **Galería:** las imágenes de `frontend/public/galeria/` son ilustraciones.
  Para usar fotos reales, dejalas en esa carpeta y actualizá la lista de
  `frontend/src/services/rooftopService.js`.
- **Cartelera, DJs, playlists y menú:** salen de `backend/src/db/seed.js`.

## API

Todas las respuestas tienen la forma `{ "success": true, "data": ... }` o
`{ "success": false, "message": "..." }`. Las rutas marcadas con 🔒 exigen el
header `x-admin-key` con la clave de administrador (si falta o es incorrecta
responden `401`).

### DJs

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/djs` | Todos los DJs |
| GET | `/api/djs/:id` | Un DJ |
| POST | `/api/djs` | Alta (pública: formulario "¿Sos DJ?") |
| PUT 🔒 | `/api/djs/:id` | Edición |
| DELETE 🔒 | `/api/djs/:id` | Baja (no se puede si toca en una fecha próxima) |
| POST | `/api/djs/:id/like` | Suma un like |
| GET | `/api/djs/:id/playlists` | Playlists del DJ con sus canciones |
| GET | `/api/djs/:id/similares` | Hasta 3 DJs parecidos (primero los del mismo género) |
| GET | `/api/djs/:id/recomendaciones` | Temas que le recomendó el público |
| POST | `/api/djs/:id/recomendaciones` | Recomendarle un tema |

```json
// POST /api/djs  ·  PUT /api/djs/:id
{ "nombre": "Bonobo", "generoMusical": "Downtempo", "biografia": "Opcional", "cantidadLikes": 0 }

// POST /api/djs/:id/recomendaciones
{ "tituloCancion": "Teardrop", "artista": "Massive Attack", "mensaje": "Opcional", "nombre": "Opcional" }
```

### Eventos

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/eventos` | Cartelera ordenada por fecha, con los DJs de cada evento |
| GET | `/api/eventos/:id` | Un evento |
| POST 🔒 | `/api/eventos` | Alta |
| PUT 🔒 | `/api/eventos/:id` | Edición (la capacidad no puede bajar de lo ya vendido) |
| DELETE 🔒 | `/api/eventos/:id` | Baja (no se puede si ya tiene reservas) |

Filtros opcionales de `GET /api/eventos`: `genero`, `dj` (ID), `desde` y
`hasta` (`AAAA-MM-DD`) y `disponibles=true`.

```json
// POST /api/eventos  ·  PUT /api/eventos/:id
{
  "nombre": "Sunset Sessions",
  "fecha": "2026-12-05",
  "horaInicio": "22:00",
  "horaFin": "04:00",
  "capacidadMaxima": 150,
  "precio": 8000,
  "idsDJ": [1, 2],
  "descripcion": "Opcional"
}
```

### Reservas y entradas

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/reservas` | Compra: descuenta cupo y genera las entradas |
| GET | `/api/reservas?email=` | Reservas hechas con ese email |
| GET | `/api/reservas/:id` | Detalle de una reserva |
| DELETE | `/api/reservas/:id?email=` | Cancela la reserva (hay que indicar el email de la compra) |
| GET | `/api/entradas/:codigo` | Consulta una entrada: `valida`, `usada` o `cancelada` |
| POST 🔒 | `/api/entradas/:codigo/validar` | Control de puerta: marca la entrada como usada |

```json
// POST /api/reservas  ("pedido" es opcional)
{
  "idEvento": 1,
  "cantidadEntradas": 2,
  "nombre": "Ana Pérez",
  "email": "ana@mail.com",
  "pedido": [{ "idItem": 1, "cantidad": 2 }]
}
```

Una reserva no se puede cancelar si el evento ya pasó o si alguna de sus
entradas ya se usó.

### Menú

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/menu` | Ítems del menú. Filtros opcionales: `categoria` y `q` (texto) |
| GET | `/api/menu/:id` | Un ítem |
| POST 🔒 | `/api/menu` | Alta |
| PUT 🔒 | `/api/menu/:id` | Edición |
| DELETE 🔒 | `/api/menu/:id` | Baja |

```json
// POST /api/menu  ·  PUT /api/menu/:id
{ "nombre": "Negroni de la casa", "descripcion": "Opcional", "precio": 7500, "categoria": "Cocktails" }
```

### Administración

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST 🔒 | `/api/admin/login` | Verifica la clave (la usa el panel al entrar) |
| GET 🔒 | `/api/admin/reservas` | Todas las reservas, de la más nueva a la más vieja |

## Organización del código

```
backend/
├── src/
│   ├── config/        # variables de entorno (.env)
│   ├── db/            # store (persistencia en JSON) y datos de ejemplo
│   ├── models/        # clases del modelo (DJ, Evento, Reserva, Entrada, …)
│   ├── repositories/  # acceso a los datos de cada colección
│   ├── services/      # reglas de negocio
│   ├── controllers/   # traducen HTTP ↔ servicios
│   ├── routes/        # rutas de la API
│   ├── middlewares/   # validaciones, clave de admin y manejo de errores
│   ├── enums/         # códigos HTTP y mensajes
│   ├── exceptions/    # errores de la aplicación
│   └── responses/     # formato único de respuesta
├── tests/             # tests con node:test (corren sobre una base en memoria)
└── data/              # db.json (se crea solo; no se sube al repositorio)

frontend/src/
├── pages/       # una por ruta: Home, Evento, MisEntradas, Admin, NotFound
├── components/  # layout, home, events, dj, sections, tickets, admin, ui
├── services/    # toda la comunicación con la API (fetch centralizado en api.js)
├── context/     # ToastContext: notificaciones globales
├── utils/       # formato, validadores, hooks (useAsync, useDialog), datos fijos
└── styles/      # variables, reset y estilos globales
```

### Persistencia

Los datos se guardan en `backend/data/db.json`, así que sobreviven a los
reinicios del servidor. La primera vez se crea con los datos de ejemplo.
Las fechas de la cartelera de ejemplo se calculan desde el día en que se
genera el archivo: si quedaron viejas, `npm run seed` las regenera (y borra
las reservas).

### Accesibilidad y celular

- Los modales atrapan el foco, se cierran con Escape y devuelven el foco al
  botón que los abrió (`utils/useDialog.js`).
- Navegación completa por teclado, link "Saltar al contenido" y mensajes de
  estado anunciados a lectores de pantalla.
- En pantallas chicas la navegación pasa a un menú desplegable y los
  formularios, tablas y tarjetas se reacomodan sin scroll horizontal.
