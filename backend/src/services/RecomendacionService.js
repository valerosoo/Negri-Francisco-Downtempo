import recomendacionRepository from "../repositories/RecomendacionRepository.js";
import djService from "./DJService.js";

class RecomendacionService {
    // Temas que el público le recomendó a un DJ, del más nuevo al más viejo.
    getByDJ(idDJ) {
        djService.getById(idDJ);

        return recomendacionRepository
            .findByDJ(idDJ)
            .toSorted((a, b) => b.fecha.localeCompare(a.fecha) || b.idRecomendacion - a.idRecomendacion);
    }

    create(idDJ, { tituloCancion, artista, mensaje = "", nombre = "" }) {
        djService.getById(idDJ);

        return recomendacionRepository.create({
            idDJ,
            tituloCancion: tituloCancion.trim(),
            artista: artista.trim(),
            mensaje: mensaje.trim(),
            nombreCliente: nombre.trim()
        });
    }
}

export default new RecomendacionService();
