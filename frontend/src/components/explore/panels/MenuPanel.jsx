import { useAsync } from "../../../utils/useAsync.js";
import { getMenuCategorias } from "../../../services/menuService.js";
import PlaceholderImage from "../../ui/PlaceholderImage.jsx";
import Spinner from "../../ui/Spinner.jsx";
import "./panels.css";
import "./MenuPanel.css";

function MenuPanel() {
  const { data: categorias, loading, error } = useAsync(getMenuCategorias, []);

  return (
    <div>
      <h3>
        Nuestro <span className="accent">Menú</span>
      </h3>
      <hr className="rule" />
      <p className="panel-text">
        Una selección de tragos, cervezas, vinos y sabores para acompañar tu noche.
      </p>

      {loading && <Spinner label="Cargando el menú…" />}

      {error && <p className="panel-state panel-state--error">No pudimos cargar el menú: {error}</p>}

      {categorias && (
        <ul className="menu-grid">
          {categorias.map((categoria) => (
            <li key={categoria.id} className="menu-card">
              <PlaceholderImage label={`Foto de la categoría ${categoria.nombre}`} ratio="3 / 4" />
              <p className="menu-card__name">{categoria.nombre}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MenuPanel;
