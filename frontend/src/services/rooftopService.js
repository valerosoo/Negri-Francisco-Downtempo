// Mismo caso que menuService: todavía no hay endpoint de galería/rooftop en
// el backend, se simula con una Promise para no romper el contrato cuando
// exista.
const GALERIA = [
  { id: 1, label: "Vista del rooftop al atardecer" },
  { id: 2, label: "Barra principal durante un show" },
  { id: 3, label: "Pista y skyline de Buenos Aires de fondo" },
];

export function getRooftopGaleria() {
  return Promise.resolve(GALERIA);
}
