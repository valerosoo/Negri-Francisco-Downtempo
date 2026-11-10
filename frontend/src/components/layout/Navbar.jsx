import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const LINKS = [
  { to: "/#djs", label: "DJs" },
  { to: "/#menu", label: "Menú" },
  { to: "/#rooftop", label: "Rooftop" },
  { to: "/#footer-ubicacion", label: "Ubicación" },
  { to: "/mis-entradas", label: "Mis entradas" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // En celular el menú se cierra al elegir un link y con Escape.
  const cerrar = () => setOpen(false);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={cerrar}>
          Downtempo
        </Link>

        <nav aria-label="Navegación principal" className="navbar__nav">
          <button
            type="button"
            className="navbar__toggle"
            aria-expanded={open}
            aria-controls="navbar-links"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="visually-hidden">{open ? "Cerrar menú" : "Abrir menú"}</span>
            <span className={`navbar__burger${open ? " navbar__burger--open" : ""}`} aria-hidden="true" />
          </button>

          <ul id="navbar-links" className={`navbar__links${open ? " navbar__links--open" : ""}`}>
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} onClick={cerrar} aria-current={location.pathname === link.to ? "page" : undefined}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link to="/#entradas" className="navbar__cta" onClick={cerrar}>
            Entradas
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
