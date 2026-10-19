import { useState } from "react";
import FormField from "../ui/FormField.jsx";
import Button from "../ui/Button.jsx";
import { validateDJForm } from "../../utils/validators.js";
import "./DJForm.css";

const EMPTY_FORM = { nombre: "", generoMusical: "", biografia: "" };

function toFormValues(dj) {
  if (!dj) return EMPTY_FORM;
  return { nombre: dj.nombre, generoMusical: dj.generoMusical, biografia: dj.biografia ?? "" };
}

// Un solo formulario para crear y para editar: en modo edición recibe
// initialValues y un onCancel para volver al modo "alta". El padre monta
// este componente con key={dj?.idDJ ?? "create"}, así que cada vez que
// cambia el DJ a editar, React lo remonta solo y los valores iniciales ya
// salen correctos sin necesitar un efecto para resincronizarlos.
function DJForm({ initialValues = null, onSubmit, onCancel, submitLabel }) {
  const [values, setValues] = useState(() => toFormValues(initialValues));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(initialValues);

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      nombre: values.nombre.trim(),
      generoMusical: values.generoMusical.trim(),
      biografia: values.biografia.trim(),
      ...(isEditing ? { cantidadLikes: initialValues.cantidadLikes } : {}),
    };

    const validationErrors = validateDJForm(payload);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(payload);

      if (!isEditing) {
        setValues(EMPTY_FORM);
      }
    } catch {
      // El error ya se notificó por toast en el componente padre.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="dj-form" onSubmit={handleSubmit} noValidate>
      <FormField
        id="dj-nombre"
        label="Nombre artístico"
        value={values.nombre}
        onChange={handleChange("nombre")}
        error={errors.nombre}
        required
        autoComplete="off"
      />

      <FormField
        id="dj-genero"
        label="Género musical"
        value={values.generoMusical}
        onChange={handleChange("generoMusical")}
        error={errors.generoMusical}
        required
        autoComplete="off"
      />

      <FormField
        id="dj-bio"
        label="Biografía"
        as="textarea"
        value={values.biografia}
        onChange={handleChange("biografia")}
        error={errors.biografia}
        hint="Opcional, hasta 400 caracteres."
      />

      <div className="dj-form__actions">
        <Button type="submit" loading={submitting}>
          {submitLabel ?? (isEditing ? "Guardar cambios" : "Enviar presentación")}
        </Button>
        {isEditing && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancelar edición
          </Button>
        )}
      </div>
    </form>
  );
}

export default DJForm;
