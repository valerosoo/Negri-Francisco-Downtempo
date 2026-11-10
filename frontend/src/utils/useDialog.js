import { useEffect, useRef } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

// Comportamiento accesible de un modal, en un solo lugar:
// - al abrir, mueve el foco adentro (al elemento con data-autofocus o al primero enfocable);
// - Tab y Shift+Tab quedan atrapados dentro del diálogo;
// - Escape lo cierra;
// - bloquea el scroll del fondo;
// - al cerrar, devuelve el foco al elemento que lo abrió.
// Devuelve el ref que hay que poner en el contenedor del diálogo.
export function useDialog(onClose, open = true) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;

    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;
    const focusables = () => [...dialog.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);

    (dialog.querySelector("[data-autofocus]") ?? focusables()[0] ?? dialog).focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open]);

  return dialogRef;
}
