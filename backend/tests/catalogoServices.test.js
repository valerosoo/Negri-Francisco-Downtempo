import "./setup.js";
import { beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import store from "../src/db/store.js";
import djService from "../src/services/DJService.js";
import eventoService from "../src/services/EventoService.js";
import menuService from "../src/services/MenuService.js";
import reservaService from "../src/services/ReservaService.js";
import recomendacionService from "../src/services/RecomendacionService.js";
import { BadRequestError, ConflictError, NotFoundError } from "../src/exceptions/AppError.js";
import { Messages } from "../src/enums/Messages.js";
import { diasDesdeHoy } from "../src/utils/fechas.js";

const conMensaje = (ErrorClass, message) => (error) => error instanceof ErrorClass && error.message === message;

const nuevoEvento = (extra = {}) => ({
    nombre: " Noche de prueba ",
    fecha: diasDesdeHoy(5),
    horaInicio: "22:00",
    horaFin: "04:00",
    capacidadMaxima: 50,
    precio: 5000,
    idsDJ: [1, 1, 2],
    ...extra
});

beforeEach(() => store.reset());

describe("DJService", () => {
    it("no permite dos DJs con el mismo nombre (sin importar mayúsculas)", () => {
        assert.throws(
            () => djService.create({ nombre: " bonobo ", generoMusical: "House" }),
            conMensaje(ConflictError, Messages.DJ_DUPLICATED)
        );
    });

    it("crea un DJ con valores por defecto y recorta espacios", () => {
        const dj = djService.create({ nombre: "  Rival Consoles ", generoMusical: " Ambient " });

        assert.deepEqual(
            { nombre: dj.nombre, generoMusical: dj.generoMusical, biografia: dj.biografia, likes: dj.cantidadLikes },
            { nombre: "Rival Consoles", generoMusical: "Ambient", biografia: "", likes: 0 }
        );
    });

    it("suma un like por vez", () => {
        const antes = djService.getById(1).cantidadLikes;

        assert.equal(djService.like(1).cantidadLikes, antes + 1);
    });

    it("al editar conserva los likes si no se envían", () => {
        const antes = djService.getById(2).cantidadLikes;

        const dj = djService.update(2, { nombre: "Tycho", generoMusical: "Ambient" });

        assert.equal(dj.cantidadLikes, antes);
        assert.equal(dj.generoMusical, "Ambient");
    });

    it("recomienda primero a los DJs del mismo género", () => {
        const similares = djService.getSimilares(1);

        assert.equal(similares.length, 3);
        assert.equal(similares[0].nombre, "Thievery Corporation");
        assert.equal(similares[0].mismoGenero, true);
        assert.ok(similares.every((dj) => dj.idDJ !== 1));
    });

    it("devuelve las playlists del DJ con sus canciones", () => {
        const [playlist] = djService.getPlaylists(1);

        assert.equal(playlist.idDJ, 1);
        assert.ok(playlist.canciones.length > 0);
    });

    it("no deja eliminar un DJ que toca en una fecha próxima", () => {
        assert.throws(() => djService.delete(1), conMensaje(ConflictError, Messages.DJ_CON_EVENTOS));
    });

    it("al eliminar un DJ también se van sus playlists y recomendaciones", () => {
        const dj = djService.create({ nombre: "Invitado", generoMusical: "House" });
        recomendacionService.create(dj.idDJ, { tituloCancion: "Tema", artista: "Alguien" });

        djService.delete(dj.idDJ);

        assert.throws(() => djService.getById(dj.idDJ), NotFoundError);
        assert.equal(store.get("recomendaciones").length, 0);
    });
});

describe("EventoService", () => {
    it("devuelve la cartelera ordenada por fecha y con los DJs resueltos", () => {
        const eventos = eventoService.getAll();
        const fechas = eventos.map((evento) => evento.fecha);

        assert.deepEqual(fechas, fechas.toSorted());
        assert.deepEqual(
            eventos[0].djs.map((dj) => dj.nombre),
            ["Bonobo", "Tycho"]
        );
    });

    it("filtra por género, por DJ y por rango de fechas", () => {
        assert.deepEqual(
            eventoService.getAll({ genero: "chillwave" }).map((evento) => evento.idEvento),
            [1, 4]
        );
        assert.deepEqual(
            eventoService.getAll({ dj: 6 }).map((evento) => evento.idEvento),
            [2]
        );
        assert.deepEqual(
            eventoService.getAll({ desde: diasDesdeHoy(5), hasta: diasDesdeHoy(20) }).map((evento) => evento.idEvento),
            [2, 3]
        );
    });

    it("el filtro de disponibles deja afuera los eventos agotados", () => {
        store.get("eventos").find((evento) => evento.idEvento === 1).entradasDisponibles = 0;

        assert.ok(!eventoService.getAll({ disponibles: true }).some((evento) => evento.idEvento === 1));
    });

    it("crea un evento con todo el cupo disponible y sin DJs repetidos", () => {
        const evento = eventoService.create(nuevoEvento());

        assert.equal(evento.nombre, "Noche de prueba");
        assert.equal(evento.entradasDisponibles, 50);
        assert.deepEqual(evento.idsDJ, [1, 2]);
    });

    it("rechaza un evento con un DJ inexistente", () => {
        assert.throws(
            () => eventoService.create(nuevoEvento({ idsDJ: [999] })),
            conMensaje(BadRequestError, Messages.EVENTO_DJ_NOT_FOUND)
        );
    });

    it("al cambiar la capacidad conserva las entradas ya vendidas", () => {
        reservaService.create({ idEvento: 1, cantidadEntradas: 4, nombre: "Ana", email: "ana@mail.com" });
        const actual = eventoService.getById(1);

        const editado = eventoService.update(1, { ...actual, capacidadMaxima: 100 });

        assert.equal(editado.entradasDisponibles, 96);
    });

    it("no deja bajar la capacidad por debajo de lo vendido", () => {
        reservaService.create({ idEvento: 1, cantidadEntradas: 4, nombre: "Ana", email: "ana@mail.com" });
        const actual = eventoService.getById(1);

        assert.throws(
            () => eventoService.update(1, { ...actual, capacidadMaxima: 3 }),
            conMensaje(ConflictError, Messages.EVENTO_CAPACIDAD_INSUFICIENTE)
        );
    });

    it("no deja eliminar un evento con entradas vendidas", () => {
        reservaService.create({ idEvento: 1, cantidadEntradas: 1, nombre: "Ana", email: "ana@mail.com" });

        assert.throws(() => eventoService.delete(1), conMensaje(ConflictError, Messages.EVENTO_CON_RESERVAS));
    });
});

describe("MenuService", () => {
    it("filtra por categoría y por texto", () => {
        assert.ok(menuService.getAll({ categoria: "cervezas" }).every((item) => item.categoria === "Cervezas"));
        assert.deepEqual(
            menuService.getAll({ q: "jengibre" }).map((item) => item.nombre),
            ["Mezcal Mule", "Limonada de jengibre"]
        );
    });

    it("hace alta, edición y baja de un ítem", () => {
        const item = menuService.create({ nombre: " Fernet ", precio: 6000, categoria: "Cocktails" });
        assert.equal(item.nombre, "Fernet");
        assert.equal(item.descripcion, "");

        const editado = menuService.update(item.idItem, { ...item, precio: 6500 });
        assert.equal(editado.precio, 6500);

        menuService.delete(item.idItem);
        assert.throws(() => menuService.getById(item.idItem), NotFoundError);
    });

    it("no permite dos ítems con el mismo nombre", () => {
        assert.throws(
            () => menuService.create({ nombre: "malbec", precio: 1, categoria: "Vinos" }),
            conMensaje(ConflictError, Messages.ITEM_DUPLICATED)
        );
    });
});

describe("RecomendacionService", () => {
    it("guarda la recomendación dirigida al DJ y la lista primero la más nueva", () => {
        recomendacionService.create(1, { tituloCancion: " Teardrop ", artista: "Massive Attack", nombre: "Ana" });
        recomendacionService.create(1, { tituloCancion: "Roads", artista: "Portishead", mensaje: "Para el cierre" });
        recomendacionService.create(2, { tituloCancion: "Otra", artista: "Otro" });

        const recomendaciones = recomendacionService.getByDJ(1);

        assert.deepEqual(
            recomendaciones.map((r) => r.tituloCancion),
            ["Roads", "Teardrop"]
        );
        assert.equal(recomendaciones[1].nombreCliente, "Ana");
    });

    it("rechaza recomendaciones para un DJ inexistente", () => {
        assert.throws(
            () => recomendacionService.create(999, { tituloCancion: "Tema", artista: "Alguien" }),
            NotFoundError
        );
    });
});
