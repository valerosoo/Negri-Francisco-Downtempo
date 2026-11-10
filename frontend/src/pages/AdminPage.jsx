import { useCallback, useState } from "react";
import Button from "../components/ui/Button.jsx";
import FormField from "../components/ui/FormField.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import AdminEventos from "../components/admin/AdminEventos.jsx";
import AdminDJs from "../components/admin/AdminDJs.jsx";
import AdminMenu from "../components/admin/AdminMenu.jsx";
import AdminEntradas from "../components/admin/AdminEntradas.jsx";
import { getAdminKey, loginAdmin, logoutAdmin } from "../services/adminService.js";
import { useToast } from "../context/ToastContext.jsx";
import "../components/sections/panels.css";
import "./AdminPage.css";

const TABS = [
  { id: "eventos", label: "Cartelera", Component: AdminEventos },
  { id: "djs", label: "DJs", Component: AdminDJs },
  { id: "menu", label: "Menú", Component: AdminMenu },
  { id: "entradas", label: "Entradas y ventas", Component: AdminEntradas },
];

// Panel de administración: pide la clave (ADMIN_KEY del backend) y después
// permite gestionar la cartelera, los DJs y el menú, y controlar las entradas.
function AdminPage() {
  const toast = useToast();
  const [autenticado, setAutenticado] = useState(() => Boolean(getAdminKey()));
  const [tab, setTab] = useState(TABS[0].id);

  const salir = useCallback(() => {
    logoutAdmin();
    setAutenticado(false);
  }, []);

  // Ejecuta una operación de administración: avisa el resultado por toast y,
  // si el backend rechaza la clave (401), cierra la sesión.
  const run = async (action, successMessage) => {
    try {
      const result = await action();
      if (successMessage) toast.success(successMessage);
      return result;
    } catch (err) {
      if (err.status === 401) salir();
      toast.error(err.message);
      throw err;
    }
  };

  if (!autenticado) {
    return <AdminLogin onLogin={() => setAutenticado(true)} />;
  }

  const { Component } = TABS.find((item) => item.id === tab);

  return (
    <div className="page container admin">
      <div className="admin__top">
        <SectionHeading lead="Panel de" highlight="administración" level={1} />
        <Button variant="secondary" onClick={salir}>
          Cerrar sesión
        </Button>
      </div>

      <div className="admin__tabs" role="group" aria-label="Secciones del panel">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="admin__tab"
            aria-pressed={tab === item.id}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <Component run={run} />
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!clave) {
      setError("Ingresá la clave.");
      return;
    }

    setSubmitting(true);

    try {
      await loginAdmin(clave);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page container admin admin--login">
      <SectionHeading lead="Panel de" highlight="administración" level={1} />
      <p className="page__intro">Solo para el equipo de Downtempo. Ingresá la clave para continuar.</p>

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="admin-clave"
          label="Clave de administrador"
          type="password"
          value={clave}
          onChange={(event) => setClave(event.target.value)}
          error={error}
          autoComplete="current-password"
          required
        />
        <Button type="submit" loading={submitting}>
          Entrar
        </Button>
      </form>
    </div>
  );
}

export default AdminPage;
