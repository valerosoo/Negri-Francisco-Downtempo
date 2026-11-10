import { useState } from "react";
import Button from "../ui/Button.jsx";
import ConfirmDialog from "../ui/ConfirmDialog.jsx";
import Spinner from "../ui/Spinner.jsx";

// Esqueleto común de las pestañas de administración: tabla con los registros
// (con Editar / Eliminar) a la izquierda y el formulario de alta o edición a
// la derecha. Cada pestaña define sus columnas y su formulario.
//
// `children` es una función que recibe { editing, stopEditing } y devuelve el
// formulario. `onDelete(item)` debe devolver una promesa.
function CrudPanel({ titulo, tituloForm, items, loading, error, columns, getId, getNombre, onDelete, children }) {
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const stopEditing = () => setEditing(null);

  const handleConfirmDelete = async () => {
    setDeleting(true);

    try {
      await onDelete(pendingDelete);
      if (editing && getId(editing) === getId(pendingDelete)) stopEditing();
    } catch {
      // El error ya se notificó por toast.
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  return (
    <div className="admin-crud">
      <section aria-label={titulo}>
        <h2 className="admin__subtitle">{titulo}</h2>

        {loading && !items && <Spinner />}

        {error && (
          <p className="panel-state panel-state--error" role="alert">
            {error}
          </p>
        )}

        {items && items.length === 0 && <p className="admin__empty">Todavía no hay nada cargado.</p>}

        {items && items.length > 0 && (
          <div className="admin-table__scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.header} scope="col">
                      {column.header}
                    </th>
                  ))}
                  <th scope="col">
                    <span className="visually-hidden">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={getId(item)} aria-current={editing && getId(editing) === getId(item) ? "true" : undefined}>
                    {columns.map((column) => (
                      <td key={column.header}>{column.render(item)}</td>
                    ))}
                    <td className="admin-table__actions">
                      <Button variant="ghost" onClick={() => setEditing(item)}>
                        Editar<span className="visually-hidden"> {getNombre(item)}</span>
                      </Button>
                      <Button variant="ghost" className="btn btn--ghost btn--ghost-danger" onClick={() => setPendingDelete(item)}>
                        Eliminar<span className="visually-hidden"> {getNombre(item)}</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-crud__form" aria-label={tituloForm}>
        <h2 className="admin__subtitle">{editing ? `Editando: ${getNombre(editing)}` : tituloForm}</h2>
        {children({ editing, stopEditing })}
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Eliminar"
        description={
          pendingDelete ? `¿Seguro que querés eliminar “${getNombre(pendingDelete)}”? Esta acción no se puede deshacer.` : ""
        }
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default CrudPanel;
