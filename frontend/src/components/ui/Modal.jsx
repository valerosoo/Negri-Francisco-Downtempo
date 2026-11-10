import { useDialog } from "../../utils/useDialog.js";
import "./Modal.css";

// Contenedor de todos los modales del sitio (compra, galería, etc.). El
// manejo de foco, Escape y scroll del fondo vive en useDialog.
function Modal({ onClose, labelledBy, label, size = "md", className = "", children }) {
  const dialogRef = useDialog(onClose);

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className={`modal modal--${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={label}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
