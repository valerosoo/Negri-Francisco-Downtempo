import { Link } from "react-router-dom";
import SectionHeading from "../components/ui/SectionHeading.jsx";

function NotFoundPage() {
  return (
    <div className="page container">
      <SectionHeading lead="Página" highlight="no encontrada" level={1} />
      <p className="page__intro">La dirección que abriste no existe o cambió de lugar.</p>
      <Link to="/" className="btn btn--primary">
        Volver al inicio
      </Link>
    </div>
  );
}

export default NotFoundPage;
