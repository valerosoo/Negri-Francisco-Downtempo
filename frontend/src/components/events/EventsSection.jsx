import { useMemo, useState } from "react";
import SectionHeading from "../ui/SectionHeading.jsx";
import Spinner from "../ui/Spinner.jsx";
import Button from "../ui/Button.jsx";
import EventCard from "./EventCard.jsx";
import { fechaEnDias } from "../../utils/format.js";
import "./EventsSection.css";

const SIN_FILTROS = { genero: "", dj: "", cuando: "", soloDisponibles: false };

const PERIODOS = [
  { value: "", label: "Todas las fechas" },
  { value: "7", label: "Esta semana" },
  { value: "14", label: "Próximos 15 días" },
  { value: "30", label: "Este mes" },
];

function EventsSection({ eventos, loading, error, onRetry, onComprar }) {
  const [filtros, setFiltros] = useState(SIN_FILTROS);

  // Las opciones de los filtros salen de la propia cartelera: solo se ofrecen
  // géneros y DJs que realmente tocan en alguna fecha.
  const { generos, djs } = useMemo(() => {
    const porId = new Map();
    eventos.forEach((evento) => evento.djs.forEach((dj) => porId.set(dj.idDJ, dj)));
    const lista = [...porId.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));

    return { djs: lista, generos: [...new Set(lista.map((dj) => dj.generoMusical))].sort() };
  }, [eventos]);

  const filtrados = useMemo(() => {
    const hasta = filtros.cuando ? fechaEnDias(Number(filtros.cuando)) : null;

    return eventos.filter(
      (evento) =>
        (!filtros.genero || evento.djs.some((dj) => dj.generoMusical === filtros.genero)) &&
        (!filtros.dj || evento.djs.some((dj) => dj.idDJ === Number(filtros.dj))) &&
        (!hasta || evento.fecha <= hasta) &&
        (!filtros.soloDisponibles || evento.entradasDisponibles > 0)
    );
  }, [eventos, filtros]);

  const hayFiltros = Object.values(filtros).some(Boolean);
  const setFiltro = (campo) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setFiltros((prev) => ({ ...prev, [campo]: value }));
  };

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
          <>
            <form className="events__filters" aria-label="Filtrar la cartelera" onSubmit={(e) => e.preventDefault()}>
              <label className="filter">
                <span>Cuándo</span>
                <select value={filtros.cuando} onChange={setFiltro("cuando")}>
                  {PERIODOS.map((periodo) => (
                    <option key={periodo.value} value={periodo.value}>
                      {periodo.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="filter">
                <span>Género</span>
                <select value={filtros.genero} onChange={setFiltro("genero")}>
                  <option value="">Todos los géneros</option>
                  {generos.map((genero) => (
                    <option key={genero} value={genero}>
                      {genero}
                    </option>
                  ))}
                </select>
              </label>

              <label className="filter">
                <span>DJ</span>
                <select value={filtros.dj} onChange={setFiltro("dj")}>
                  <option value="">Todos los DJs</option>
                  {djs.map((dj) => (
                    <option key={dj.idDJ} value={dj.idDJ}>
                      {dj.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label className="filter filter--check">
                <input type="checkbox" checked={filtros.soloDisponibles} onChange={setFiltro("soloDisponibles")} />
                <span>Solo con entradas</span>
              </label>

              {hayFiltros && (
                <Button variant="ghost" onClick={() => setFiltros(SIN_FILTROS)}>
                  Limpiar filtros
                </Button>
              )}
            </form>

            <p className="events__count" role="status">
              {filtrados.length === eventos.length
                ? `${eventos.length} ${eventos.length === 1 ? "fecha" : "fechas"} en cartelera`
                : `${filtrados.length} de ${eventos.length} fechas`}
            </p>

            {filtrados.length === 0 ? (
              <p className="panel-state">Ninguna fecha coincide con esos filtros.</p>
            ) : (
              <ul className="events__list">
                {filtrados.map((evento) => (
                  <EventCard key={evento.idEvento} evento={evento} onComprar={onComprar} />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default EventsSection;
