import { useMemo } from "react";
import { useAsync } from "../../utils/useAsync.js";
import { getMenu } from "../../services/menuService.js";
import { formatPrecio } from "../../utils/format.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import Spinner from "../ui/Spinner.jsx";
import "./panels.css";
import "./MenuSection.css";

function MenuSection() {
  const { data: items, loading, error } = useAsync(getMenu, []);

  // Agrupa los ítems por categoría respetando el orden en que llegan.
  const categorias = useMemo(() => {
    const grupos = new Map();
    (items ?? []).forEach((item) => {
      if (!grupos.has(item.categoria)) grupos.set(item.categoria, []);
      grupos.get(item.categoria).push(item);
    });
    return [...grupos.entries()];
  }, [items]);

  return (
    <section className="section menu-section" id="menu" aria-labelledby="menu-heading">
      <div className="container">
        <SectionHeading id="menu-heading" lead="Nuestro" highlight="Menú" />
        <p className="panel-text menu-section__intro">
          Tragos, cervezas, vinos y opciones sin alcohol para acompañar la noche.
        </p>

        {loading && <Spinner label="Cargando el menú…" />}

        {error && <p className="panel-state panel-state--error">No pudimos cargar el menú: {error}</p>}

        {categorias.length > 0 && (
          <div className="menu-grid">
            {categorias.map(([categoria, lista]) => (
              <div key={categoria} className="menu-category">
                <h3 className="menu-category__title">{categoria}</h3>
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
      </div>
    </section>
  );
}

export default MenuSection;
