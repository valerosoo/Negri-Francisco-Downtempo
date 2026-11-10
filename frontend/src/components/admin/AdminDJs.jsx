import CrudPanel from "./CrudPanel.jsx";
import DJForm from "../dj/DJForm.jsx";
import { adminApi } from "../../services/adminService.js";
import { createDJ, getDJs } from "../../services/djService.js";
import { useAsync } from "../../utils/useAsync.js";

const COLUMNS = [
  { header: "DJ", render: (dj) => dj.nombre },
  { header: "Género", render: (dj) => dj.generoMusical },
  { header: "Likes", render: (dj) => dj.cantidadLikes },
];

// Alta, edición y baja de DJs. Reutiliza el mismo formulario del sitio público.
function AdminDJs({ run }) {
  const djs = useAsync(getDJs, []);

  const handleSave = async (payload, editing) => {
    await run(
      () => (editing ? adminApi.updateDJ(editing.idDJ, payload) : createDJ(payload)),
      editing ? "DJ modificado." : `${payload.nombre} se agregó a los DJs.`
    );
    djs.reload();
  };

  const handleDelete = async (dj) => {
    await run(() => adminApi.deleteDJ(dj.idDJ), `${dj.nombre} se eliminó.`);
    djs.reload();
  };

  return (
    <CrudPanel
      titulo="DJs"
      tituloForm="Nuevo DJ"
      items={djs.data}
      loading={djs.loading}
      error={djs.error}
      columns={COLUMNS}
      getId={(dj) => dj.idDJ}
      getNombre={(dj) => dj.nombre}
      onDelete={handleDelete}
    >
      {({ editing, stopEditing }) => (
        <DJForm
          key={editing?.idDJ ?? "create"}
          initialValues={editing}
          submitLabel={editing ? "Guardar cambios" : "Agregar DJ"}
          onSubmit={async (payload) => {
            await handleSave(payload, editing);
            if (editing) stopEditing();
          }}
          onCancel={stopEditing}
        />
      )}
    </CrudPanel>
  );
}

export default AdminDJs;
