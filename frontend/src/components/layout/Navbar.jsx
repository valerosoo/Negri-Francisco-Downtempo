import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a href="#main-content" className="navbar__logo">
          Downtempo
        </a>
        <nav aria-label="Navegación principal">
          <ul className="navbar__links">
            <li>
              <a href="#footer-contacto">Contacto</a>
            </li>
            <li>
              <a href="#footer-ubicacion">Ubicación</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
