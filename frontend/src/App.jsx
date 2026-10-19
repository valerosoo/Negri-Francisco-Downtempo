import { ToastProvider } from "./context/ToastContext.jsx";
import HomePage from "./pages/HomePage.jsx";

// App.jsx organiza la aplicación: provee el sistema de notificaciones global
// y monta la página principal. El sitio es de una sola pantalla (siguiendo
// el boceto), con navegación interna por anclas y por tabs dentro de ella.
function App() {
  return (
    <ToastProvider>
      <HomePage />
    </ToastProvider>
  );
}

export default App;
