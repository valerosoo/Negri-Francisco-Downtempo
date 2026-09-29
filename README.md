# Negri-Francisco-Downtempo

## Backend (MVC)

```bash
cd Backend
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
