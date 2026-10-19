import { useEffect, useRef } from "react";
import "./ExplorePanelDialog.css";

function ExplorePanelDialog({ open, title, onClose, children }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="explore-dialog__overlay" onClick={onClose}>
      <div
        className="explore-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="explore-dialog__close" onClick={onClose} aria-label="Cerrar y volver al mapa">
          × <span className="visually-hidden">Cerrar</span>
        </button>
        <div className="explore-dialog__content">{children}</div>
      </div>
    </div>
  );
}

export default ExplorePanelDialog;
