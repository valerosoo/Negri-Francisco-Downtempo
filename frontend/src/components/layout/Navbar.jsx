import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a href="#main-content" className="navbar__logo">
          Downtempo
        </a>
        <nav aria-label="Navegación principal" className="navbar__nav">
          <ul className="navbar__links">
            <li>
              <a href="#djs">DJs</a>
            </li>
            <li>
              <a href="#menu">Menú</a>
            </li>
            <li>
              <a href="#rooftop">Rooftop</a>
            </li>
            <li>
              <a href="#footer-ubicacion">Ubicación</a>
            </li>
          </ul>
          <a href="#entradas" className="navbar__cta">
            Entradas
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
