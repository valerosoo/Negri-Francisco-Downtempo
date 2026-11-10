import { useCallback, useEffect, useState } from "react";

// Hook auxiliar para no repetir el patrón "loading / error / data" en cada
// pantalla que consume un servicio. Al recargar (reload) conserva los datos
// anteriores mientras llegan los nuevos, así la pantalla no parpadea.
export function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const run = useCallback(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    asyncFn()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ data: null, loading: false, error: error.message });
      });

    return () => {
      cancelled = true;
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => run(), [run]);

  return { ...state, reload: run };
}
