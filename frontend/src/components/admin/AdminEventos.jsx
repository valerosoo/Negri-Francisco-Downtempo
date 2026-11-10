import { useState } from "react";
import Button from "../ui/Button.jsx";
import FormField from "../ui/FormField.jsx";
import CrudPanel from "./CrudPanel.jsx";
import { adminApi } from "../../services/adminService.js";
import { getEventos } from "../../services/eventoService.js";
import { getDJs } from "../../services/djService.js";
import { useAsync } from "../../utils/useAsync.js";
import { fechaLarga, formatPrecio } from "../../utils/format.js";
import { validateEventoForm } from "../../utils/validators.js";

const COLUMNS = [
  { header: "Evento", render: (evento) => evento.nombre },
  { header: "Fecha", render: (evento) => `${fechaLarga(evento.fecha)} · ${evento.horaInicio}` },
  { header: "Precio", render: (evento) => formatPrecio(evento.precio) },
  {
    header: "Vendidas",
    render: (evento) => `${evento.capacidadMaxima - evento.entradasDisponibles} / ${evento.capacidadMaxima}`,
  },
];

// Alta, edición y baja de fechas de la cartelera (incluye las ya pasadas).
function AdminEventos({ run }) {
  const eventos = useAsync(getEventos, []);
  const djs = useAsync(getDJs, []);

  const handleSave = async (payload, editing) => {
    await run(
      () => (editing ? adminApi.updateEvento(editing.idEvento, payload) : adminApi.createEvento(payload)),
      editing ? "Evento modificado." : `${payload.nombre} se agregó a la cartelera.`
    );
    eventos.reload();
  };

  const handleDelete = async (evento) => {
    await run(() => adminApi.deleteEvento(evento.idEvento), `${evento.nombre} se eliminó de la cartelera.`);
    eventos.reload();
  };

  return (
    <CrudPanel
      titulo="Cartelera"
      tituloForm="Nueva fecha"
      items={eventos.data}
      loading={eventos.loading}
      error={eventos.error}
      columns={COLUMNS}
      getId={(evento) => evento.idEvento}
      getNombre={(evento) => evento.nombre}
      onDelete={handleDelete}
    >
      {({ editing, stopEditing }) => (
        <EventoForm
          key={editing?.idEvento ?? "create"}
          evento={editing}
          djs={djs.data ?? []}
          onSubmit={(payload) => handleSave(payload, editing)}
          onDone={stopEditing}
        />
      )}
    </CrudPanel>
  );
}

const EMPTY = {
  nombre: "",
  fecha: "",
  horaInicio: "22:00",
  horaFin: "04:00",
  capacidadMaxima: "",
  precio: "",
  descripcion: "",
  idsDJ: [],
};

function toFormValues(evento) {
  if (!evento) return EMPTY;

  return {
    nombre: evento.nombre,
    fecha: evento.fecha,
    horaInicio: evento.horaInicio,
    horaFin: evento.horaFin,
    capacidadMaxima: String(evento.capacidadMaxima),
    precio: String(evento.precio),
    descripcion: evento.descripcion ?? "",
    idsDJ: evento.idsDJ,
  };
}

function EventoForm({ evento, djs, onSubmit, onDone }) {
  const [values, setValues] = useState(() => toFormValues(evento));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (campo) => (event) => setValues((prev) => ({ ...prev, [campo]: event.target.value }));

  const toggleDJ = (idDJ) => {
    setValues((prev) => ({
      ...prev,
      idsDJ: prev.idsDJ.includes(idDJ) ? prev.idsDJ.filter((id) => id !== idDJ) : [...prev.idsDJ, idDJ],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      nombre: values.nombre.trim(),
      fecha: values.fecha,
      horaInicio: values.horaInicio,
      horaFin: values.horaFin,
      capacidadMaxima: values.capacidadMaxima === "" ? NaN : Number(values.capacidadMaxima),
      precio: values.precio === "" ? NaN : Number(values.precio),
      descripcion: values.descripcion.trim(),
      idsDJ: values.idsDJ,
    };

    const found = validateEventoForm(payload);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);

    try {
      await onSubmit(payload);
      if (evento) onDone();
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
        id="evento-nombre"
        label="Nombre"
        value={values.nombre}
        onChange={handleChange("nombre")}
        error={errors.nombre}
        required
      />
      <FormField
        id="evento-fecha"
        label="Fecha"
        type="date"
        value={values.fecha}
        onChange={handleChange("fecha")}
        error={errors.fecha}
        required
      />
      <div className="admin-form__row">
        <FormField
          id="evento-inicio"
          label="Desde"
          type="time"
          value={values.horaInicio}
          onChange={handleChange("horaInicio")}
          error={errors.horaInicio}
          required
        />
        <FormField
          id="evento-fin"
          label="Hasta"
          type="time"
          value={values.horaFin}
          onChange={handleChange("horaFin")}
          error={errors.horaFin}
          required
        />
      </div>
      <div className="admin-form__row">
        <FormField
          id="evento-capacidad"
          label="Capacidad"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          value={values.capacidadMaxima}
          onChange={handleChange("capacidadMaxima")}
          error={errors.capacidadMaxima}
          required
        />
        <FormField
          id="evento-precio"
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
      </div>
      <FormField
        id="evento-descripcion"
        label="Descripción"
        as="textarea"
        value={values.descripcion}
        onChange={handleChange("descripcion")}
        hint="Opcional. Se muestra en la página del evento."
      />

      <fieldset className="admin-form__checks">
        <legend>Line-up</legend>
        {djs.length === 0 && <p className="admin__empty">No hay DJs cargados.</p>}
        {djs.map((dj) => (
          <label key={dj.idDJ} className="filter filter--check">
            <input type="checkbox" checked={values.idsDJ.includes(dj.idDJ)} onChange={() => toggleDJ(dj.idDJ)} />
            <span>{dj.nombre}</span>
          </label>
        ))}
      </fieldset>

      <div className="admin-form__actions">
        <Button type="submit" loading={submitting}>
          {evento ? "Guardar cambios" : "Agregar fecha"}
        </Button>
        {evento && (
          <Button variant="ghost" onClick={onDone} disabled={submitting}>
            Cancelar edición
          </Button>
        )}
      </div>
    </form>
  );
}

export default AdminEventos;
