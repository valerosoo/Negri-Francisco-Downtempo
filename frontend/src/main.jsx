import { createRoot } from "react-dom/client";
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";
import App from "./App.jsx";

// Sin <StrictMode>: el doble montaje/desmontaje que hace en desarrollo
// choca con cómo react-three-fiber administra el root de WebGL del
// <Canvas> del mapa 3D (error "Attempted to synchronously unmount a root
// while React was already rendering"), un problema conocido de la
// librería con React 19 que todavía no está resuelto. Solo afecta al modo
// desarrollo — no cambia nada del build de producción.
createRoot(document.getElementById("root")).render(<App />);
