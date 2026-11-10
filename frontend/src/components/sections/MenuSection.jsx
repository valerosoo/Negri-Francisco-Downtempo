import { useMemo, useState } from "react";
import { useAsync } from "../../utils/useAsync.js";
import { getMenu } from "../../services/menuService.js";
import { formatPrecio } from "../../utils/format.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import Spinner from "../ui/Spinner.jsx";
import "./panels.css";
import "./MenuSection.css";

const TODAS = "";

function MenuSection() {
  const { data: items, loading, error } = useAsync(getMenu, []);
  const [categoria, setCategoria] = useState(TODAS);
  const [busqueda, setBusqueda] = useState("");

  // Las categorías salen del propio menú, en el orden en que llegan.
  const categorias = useMemo(() => [...new Set((items ?? []).map((item) => item.categoria))], [items]);

  // Ítems que pasan los filtros, agrupados por categoría.
  const grupos = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    const porCategoria = new Map();

    (items ?? [])
      .filter((item) => categoria === TODAS || item.categoria === categoria)
      .filter(
        (item) =>
          !texto || item.nombre.toLowerCase().includes(texto) || item.descripcion.toLowerCase().includes(texto)
      )
      .forEach((item) => {
        if (!porCategoria.has(item.categoria)) porCategoria.set(item.categoria, []);
        porCategoria.get(item.categoria).push(item);
      });

    return [...porCategoria.entries()];
  }, [items, categoria, busqueda]);

  const cantidad = grupos.reduce((suma, [, lista]) => suma + lista.length, 0);

  return (
    <section className="section menu-section" id="menu" aria-labelledby="menu-heading">
      <div className="container">
        <SectionHeading id="menu-heading" lead="Nuestro" highlight="Menú" />
        <p className="panel-text menu-section__intro">
          Tragos, cervezas, vinos, opciones sin alcohol y algo para picar. Al comprar tu entrada podés dejar tu
          pedido encargado.
        </p>

        {loading && <Spinner label="Cargando el menú…" />}

        {error && (
          <p className="panel-state panel-state--error" role="alert">
            No pudimos cargar el menú: {error}
          </p>
        )}

        {items && items.length > 0 && (
          <>
            <div className="menu-controls">
              <div className="menu-tabs" role="group" aria-label="Filtrar el menú por categoría">
                {[TODAS, ...categorias].map((opcion) => (
                  <button
                    key={opcion || "todas"}
                    type="button"
                    className="menu-tabs__tab"
                    aria-pressed={categoria === opcion}
                    onClick={() => setCategoria(opcion)}
                  >
                    {opcion || "Todo"}
                  </button>
                ))}
              </div>

              <label className="filter menu-search">
                <span>Buscar en el menú</span>
                <input
                  type="search"
                  value={busqueda}
                  onChange={(event) => setBusqueda(event.target.value)}
                  placeholder="Ej: gin, jengibre, IPA…"
                />
              </label>
            </div>

            <p className="visually-hidden" role="status">
              {cantidad} {cantidad === 1 ? "resultado" : "resultados"}
            </p>

            {cantidad === 0 ? (
              <p className="panel-state">No encontramos nada con “{busqueda.trim()}” en esta categoría.</p>
            ) : (
              <div className="menu-grid">
                {grupos.map(([nombre, lista]) => (
                  <div key={nombre} className="menu-category">
                    <h3 className="menu-category__title">{nombre}</h3>
                    <ul>
                      {lista.map((item) => (
                        <li key={item.idItem} className="menu-item">
                          <div className="menu-item__head">
                            <span className="menu-item__name">{item.nombre}</span>
                            <span className="menu-item__price">{formatPrecio(item.precio)}</span>
                          </div>
                          <p className="menu-item__desc">{item.descripcion}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default MenuSection;
