import "./PlaceholderImage.css";

// El boceto define los recuadros de foto pero el proyecto todavía no tiene
// fotografía real del local. En vez de dejar un <img> roto, se muestra un
// bloque con el mismo rol semántico de una imagen (describe lo que mostrará),
// fácil de reemplazar por un <img src="..."> real el día que haya fotos.
function PlaceholderImage({ label, ratio = "4 / 5", accent = "lime" }) {
  return (
    <div
      className={`placeholder-image placeholder-image--${accent}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={label}
    />
  );
}

export default PlaceholderImage;
