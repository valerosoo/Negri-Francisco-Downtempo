class Recomendacion {
    constructor(idRecomendacion, tituloCancion, artista, mensaje, fecha, idDJ, nombreCliente = "") {
        this.idRecomendacion = idRecomendacion;
        this.tituloCancion = tituloCancion;
        this.artista = artista;
        this.mensaje = mensaje;
        this.fecha = fecha;
        // A qué DJ va dirigida y quién la envía.
        this.idDJ = idDJ;
        this.nombreCliente = nombreCliente;
    }
}

export default Recomendacion;
