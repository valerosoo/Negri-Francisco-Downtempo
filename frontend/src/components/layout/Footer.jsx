import { Link } from "react-router-dom";
import HoursList from "../ui/HoursList.jsx";
import VenueMap from "../ui/VenueMap.jsx";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container footer__grid">
        <div id="footer-contacto">
          <p className="footer__brand">Downtempo</p>
          <p className="footer__description">
            Rooftop bar &amp; electronic music, arte y música en Buenos Aires.
          </p>
          <ul className="footer__social" aria-label="Redes sociales de Downtempo">
            <li title="Instagram">
              <span className="visually-hidden">Instagram</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
              </svg>
            </li>
            <li title="Spotify">
              <span className="visually-hidden">Spotify</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M7 10.2c3-0.8 7-0.5 9.4 1M7.3 13c2.4-0.6 5.6-0.4 7.6 0.8M7.6 15.6c1.9-0.4 4.3-0.3 5.9 0.6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </li>
            <li title="WhatsApp">
              <span className="visually-hidden">WhatsApp</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M8.7 8.3c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .6.5.2.5.7 1.6.7 1.7.1.1.1.3 0 .4-.1.2-.1.3-.3.4-.1.2-.3.3-.4.5-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.3.1.2.1 1-.3 1.4-.4.5-1.3.9-2.2.8-.9-.1-2.8-.9-3.9-2.9-1.9-2.2-2.3-3.9-2.4-4.5 0-.6.4-1.2.6-1.4Z"
                  fill="currentColor"
                />
              </svg>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer__heading">Horarios</h4>
          <HoursList compact />
        </div>

        <div>
          <h4 className="footer__heading">Tu noche</h4>
          <ul className="footer__links">
            <li>
              <Link to="/#entradas">Cartelera y entradas</Link>
            </li>
            <li>
              <Link to="/mis-entradas">Mis entradas</Link>
            </li>
            <li>
              <Link to="/#menu">Menú</Link>
            </li>
            <li>
              <Link to="/#djs">DJs</Link>
            </li>
          </ul>
        </div>

        <div id="footer-ubicacion">
          <h4 className="footer__heading">Encontranos</h4>
          <VenueMap />
        </div>
      </div>

      <div className="footer__bottom">
        <p className="container">
          © 2026 Downtempo · Todos los derechos reservados ·{" "}
          <Link to="/admin" className="footer__admin">
            Administración
          </Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
