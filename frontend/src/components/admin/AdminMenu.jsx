import { useState } from "react";
import Button from "../ui/Button.jsx";
import FormField from "../ui/FormField.jsx";
import CrudPanel from "./CrudPanel.jsx";
import { adminApi } from "../../services/adminService.js";
import { getMenu } from "../../services/menuService.js";
import { useAsync } from "../../utils/useAsync.js";
import { formatPrecio } from "../../utils/format.js";
import { validateItemForm } from "../../utils/validators.js";

const COLUMNS = [
  { header: "Ítem", render: (item) => item.nombre },
  { header: "Categoría", render: (item) => item.categoria },
  { header: "Precio", render: (item) => formatPrecio(item.precio) },
];

// Alta, edición y baja de ítems del menú.
function AdminMenu({ run }) {
  const menu = useAsync(getMenu, []);
  const categorias = [...new Set((menu.data ?? []).map((item) => item.categoria))];

  const handleSave = async (payload, editing) => {
    await run(
      () => (editing ? adminApi.updateItem(editing.idItem, payload) : adminApi.createItem(payload)),
      editing ? "Ítem modificado." : `${payload.nombre} se agregó al menú.`
    );
    menu.reload();
  };

  const handleDelete = async (item) => {
    await run(() => adminApi.deleteItem(item.idItem), `${item.nombre} se eliminó del menú.`);
    menu.reload();
  };

  return (
    <CrudPanel
      titulo="Menú"
      tituloForm="Nuevo ítem"
      items={menu.data}
      loading={menu.loading}
      error={menu.error}
      columns={COLUMNS}
      getId={(item) => item.idItem}
      getNombre={(item) => item.nombre}
      onDelete={handleDelete}
    >
      {({ editing, stopEditing }) => (
        <ItemForm
          key={editing?.idItem ?? "create"}
          item={editing}
          categorias={categorias}
          onSubmit={(payload) => handleSave(payload, editing)}
          onDone={stopEditing}
        />
      )}
    </CrudPanel>
  );
}

const EMPTY = { nombre: "", descripcion: "", precio: "", categoria: "" };

function ItemForm({ item, categorias, onSubmit, onDone }) {
  const [values, setValues] = useState(() =>
    item
      ? { nombre: item.nombre, descripcion: item.descripcion, precio: String(item.precio), categoria: item.categoria }
      : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (campo) => (event) => setValues((prev) => ({ ...prev, [campo]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      nombre: values.nombre.trim(),
      descripcion: values.descripcion.trim(),
      precio: values.precio === "" ? NaN : Number(values.precio),
      categoria: values.categoria.trim(),
    };

    const found = validateItemForm(payload);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);

    try {
      await onSubmit(payload);
      if (item) onDone();
      else setValues(EMPTY);
    } catch {
      // El error ya se notificó por toast.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField
        id="item-nombre"
        label="Nombre"
        value={values.nombre}
        onChange={handleChange("nombre")}
        error={errors.nombre}
        required
      />
      <FormField
        id="item-categoria"
        label="Categoría"
        value={values.categoria}
        onChange={handleChange("categoria")}
        error={errors.categoria}
        list="item-categorias"
        hint="Elegí una existente o escribí una nueva."
        required
      />
      <datalist id="item-categorias">
        {categorias.map((categoria) => (
          <option key={categoria} value={categoria} />
        ))}
      </datalist>
      <FormField
        id="item-precio"
        label="Precio ($)"
        type="number"
        min="0"
        step="100"
        inputMode="numeric"
        value={values.precio}
        onChange={handleChange("precio")}
        error={errors.precio}
        required
      />
      <FormField
        id="item-descripcion"
        label="Descripción"
        as="textarea"
        value={values.descripcion}
        onChange={handleChange("descripcion")}
        hint="Opcional."
      />

      <div className="admin-form__actions">
        <Button type="submit" loading={submitting}>
          {item ? "Guardar cambios" : "Agregar al menú"}
        </Button>
        {item && (
          <Button variant="ghost" onClick={onDone} disabled={submitting}>
            Cancelar edición
          </Button>
        )}
      </div>
    </form>
  );
}

export default AdminMenu;
