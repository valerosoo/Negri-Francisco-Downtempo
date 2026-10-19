import "./SectionHeading.css";

// Patrón visual repetido en todo el boceto: título en dos colores + raya lime.
// "EXPLORÁ Downtempo", "Nuestro MENÚ", "Bienvenido a Downtempo", etc.
function SectionHeading({ id, lead, highlight, level = 2 }) {
  const Heading = `h${level}`;

  return (
    <div className="section-heading">
      <Heading id={id} className="section-heading__title">
        {lead ? `${lead} ` : ""}
        <span className="accent">{highlight}</span>
      </Heading>
      <hr className="rule" />
    </div>
  );
}

export default SectionHeading;
