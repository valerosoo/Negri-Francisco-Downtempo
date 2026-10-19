// El backend de esta entrega solo expone /api/djs (ver Entrega 2). El menú
// todavía no tiene endpoint propio, así que este servicio devuelve datos de
// ejemplo con la misma forma (una Promise) que tendrá el servicio real. El
// día que exista GET /api/menu, solo cambia la implementación de esta
// función — los componentes que la consumen no se tocan.
const CATEGORIAS = [
  {
    id: "cocktails",
    nombre: "Cocktails",
    descripcion: "Creaciones de autor con pisco, gin y mezcal.",
  },
  {
    id: "cervezas",
    nombre: "Cervezas",
    descripcion: "Selección artesanal, nacional e importada.",
  },
  {
    id: "vinos",
    nombre: "Vinos",
    descripcion: "Tintos y blancos para acompañar la noche.",
  },
  {
    id: "sin-alcohol",
    nombre: "Sin alcohol",
    descripcion: "Mocktails y bebidas frías sin alcohol.",
  },
];

export function getMenuCategorias() {
  return Promise.resolve(CATEGORIAS);
}
