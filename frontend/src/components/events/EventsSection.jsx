import SectionHeading from "../ui/SectionHeading.jsx";
import Spinner from "../ui/Spinner.jsx";
import Button from "../ui/Button.jsx";
import EventCard from "./EventCard.jsx";
import "./EventsSection.css";

function EventsSection({ eventos, loading, error, onRetry, onComprar }) {
  return (
    <section className="events section" id="entradas" aria-labelledby="entradas-heading">
      <div className="container">
        <SectionHeading id="entradas-heading" lead="Cartelera" highlight="Downtempo" />
        <p className="events__intro">
          Elegí tu noche, mirá quién toca y asegurá tu lugar. Hasta 6 entradas por compra.
        </p>

        {loading && eventos.length === 0 && <Spinner label="Cargando la cartelera…" />}

        {error && (
          <div className="panel-state panel-state--error" role="alert">
            <p>No pudimos cargar la cartelera: {error}</p>
            <Button variant="secondary" onClick={onRetry}>
              Reintentar
            </Button>
          </div>
        )}

        {!loading && !error && eventos.length === 0 && (
          <p className="panel-state">Todavía no hay fechas confirmadas. Volvé pronto.</p>
        )}

        {eventos.length > 0 && (
          <ul className="events__list">
            {eventos.map((evento) => (
              <EventCard key={evento.idEvento} evento={evento} onComprar={onComprar} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default EventsSection;
