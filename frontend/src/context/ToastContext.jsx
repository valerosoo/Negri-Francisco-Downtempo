import { createContext, useCallback, useContext, useRef, useState } from "react";
import ToastViewport from "../components/ui/ToastViewport.jsx";

const ToastContext = createContext(null);

const AUTO_DISMISS_MS = 5000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type, message) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, type, message }]);

      window.setTimeout(() => removeToast(id), AUTO_DISMISS_MS);
    },
    [removeToast]
  );

  const api = {
    success: (message) => showToast("success", message),
    error: (message) => showToast("error", message),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast debe usarse dentro de un ToastProvider");
  }

  return context;
}
