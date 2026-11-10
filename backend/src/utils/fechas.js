// Fecha local en formato AAAA-MM-DD. Se arma con componentes locales (no con
// toISOString, que es UTC) para que de noche no "salte" al día siguiente.
export const fechaISO = (date = new Date()) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
};

export const hoy = () => fechaISO();

export const diasDesdeHoy = (dias) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fechaISO(fecha);
};
