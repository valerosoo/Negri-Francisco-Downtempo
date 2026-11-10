// Galería del rooftop. Las imágenes viven en frontend/public/galeria/. Por
// ahora son ilustraciones: para usar fotos reales alcanza con dejar los
// archivos en esa carpeta y cambiar el `src` (y la descripción) acá.
// Se expone como Promise para que el día que exista un endpoint de galería
// el componente no tenga que cambiar.
const GALERIA = [
  { id: 1, src: "/galeria/atardecer.svg", label: "Vista del rooftop al atardecer" },
  { id: 2, src: "/galeria/barra.svg", label: "Barra principal durante un show" },
  { id: 3, src: "/galeria/pista.svg", label: "La pista con el DJ en cabina" },
  { id: 4, src: "/galeria/skyline.svg", label: "El skyline de Buenos Aires de noche" },
];

export function getRooftopGaleria() {
  return Promise.resolve(GALERIA);
}
