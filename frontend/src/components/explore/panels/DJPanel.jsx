import { useState } from "react";
import { useAsync } from "../../../utils/useAsync.js";
import { useToast } from "../../../context/ToastContext.jsx";
import { getDJs, createDJ, updateDJ, deleteDJ } from "../../../services/djService.js";
import DJList from "../../dj/DJList.jsx";
import DJForm from "../../dj/DJForm.jsx";
import ConfirmDialog from "../../ui/ConfirmDialog.jsx";
import "./panels.css";
import "./DJPanel.css";

function DJPanel() {
  const { data: djs, loading, error, reload } = useAsync(getDJs, []);
  const toast = useToast();

  const [editingDJ, setEditingDJ] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [likingId, setLikingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleCreate = async (payload) => {
    try {
      await createDJ(payload);
      toast.success(`${payload.nombre} se agregó a la cartelera.`);
      reload();
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateDJ(editingDJ.idDJ, payload);
      toast.success("DJ modificado correctamente.");
      setEditingDJ(null);
      reload();
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const handleLike = async (dj) => {
    setLikingId(dj.idDJ);

    try {
      await updateDJ(dj.idDJ, {
        nombre: dj.nombre,
        generoMusical: dj.generoMusical,
        biografia: dj.biografia,
        cantidadLikes: dj.cantidadLikes + 1,
      });
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLikingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    const dj = pendingDelete;
    setDeleteLoading(true);
    setDeletingId(dj.idDJ);

    try {
      await deleteDJ(dj.idDJ);
      toast.success(`${dj.nombre} se eliminó de la cartelera.`);
      if (editingDJ?.idDJ === dj.idDJ) setEditingDJ(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  return (
    <div className="panel-grid dj-panel">
      <div className="panel-block">
        <h3>
          Música en <span className="accent">Downtempo</span>
        </h3>
        <hr className="rule" />
        <p className="panel-text">La música que marca el ritmo de la noche.</p>

        <DJList
          djs={djs ?? []}
          loading={loading}
          error={error}
          onLike={handleLike}
          onEdit={setEditingDJ}
          onDelete={setPendingDelete}
          likingId={likingId}
          deletingId={deletingId}
        />
      </div>

      <div className="panel-block">
        <h3>{editingDJ ? `Editando a ${editingDJ.nombre}` : "Si sos DJ..."}</h3>
        <hr className="rule" />
        <p className="panel-text">
          {editingDJ
            ? "Modificá los datos y guardá los cambios."
            : "Podés llenar el siguiente formulario para que te presentes si querés venir a mostrar tu música."}
        </p>

        <DJForm
          key={editingDJ?.idDJ ?? "create"}
          initialValues={editingDJ}
          onSubmit={editingDJ ? handleUpdate : handleCreate}
          onCancel={() => setEditingDJ(null)}
        />
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Eliminar DJ"
        description={
          pendingDelete ? `¿Seguro que querés eliminar a ${pendingDelete.nombre}? Esta acción no se puede deshacer.` : ""
        }
        confirmLabel="Eliminar"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default DJPanel;
