import Button from "./Button.jsx";
import { useDialog } from "../../utils/useDialog.js";
import "./ConfirmDialog.css";

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading = false,
  onConfirm,
  onCancel,
}) {
  // El foco arranca en "Cancelar" (data-autofocus): la acción segura por defecto.
  const dialogRef = useDialog(onCancel, open);

  if (!open) return null;

  return (
    <div className="confirm-dialog__overlay" onClick={onCancel}>
      <div
        ref={dialogRef}
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="confirm-dialog-title">{title}</h3>
        <p id="confirm-dialog-description">{description}</p>
        <div className="confirm-dialog__actions">
          <Button variant="secondary" data-autofocus onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
