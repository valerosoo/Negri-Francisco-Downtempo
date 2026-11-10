import DJ from "../models/DJ.js";
import Evento from "../models/Evento.js";
import ItemMenu from "../models/ItemMenu.js";
import Playlist from "../models/Playlist.js";
import Cancion from "../models/Cancion.js";
import { diasDesdeHoy } from "../utils/fechas.js";

// Datos de ejemplo con los que arranca la base la primera vez (o al correr
// `npm run seed`). Las fechas de la cartelera se generan relativas al día en
// que se crea, para que siempre haya fechas futuras.
export function buildSeed() {
    const djs = [
        new DJ(1, "Bonobo", "Downtempo", "Productor británico de música electrónica.", 120),
        new DJ(2, "Tycho", "Chillwave", "Músico y productor estadounidense.", 85),
        new DJ(3, "Nicolas Jaar", "Electrónica experimental", "Compositor chileno-estadounidense.", 97),
        new DJ(4, "Thievery Corporation", "Downtempo", "Dúo de Washington que mezcla dub, bossa y trip hop.", 74),
        new DJ(5, "Washed Out", "Chillwave", "Proyecto de Ernest Greene, pionero del chillwave.", 52),
        new DJ(6, "Four Tet", "Electrónica experimental", "Productor londinense entre el folk y la pista.", 110)
    ];

    const eventos = [
        new Evento(1, diasDesdeHoy(3), "22:00", "04:00", 150, 150, "Sunset Sessions", 8000, [1, 2],
            "Arrancamos con el atardecer en el rooftop y seguimos hasta la madrugada con sets largos de downtempo y chillwave."),
        new Evento(2, diasDesdeHoy(10), "22:00", "05:00", 200, 200, "Noche Experimental", 10000, [3, 6],
            "Una noche para escuchar con atención: texturas, ritmos rotos y visuales en vivo."),
        new Evento(3, diasDesdeHoy(17), "21:00", "04:00", 120, 120, "Rooftop Downtempo", 9000, [1, 4],
            "La noche insignia de la casa. Cupo reducido para bailar cómodos bajo las estrellas."),
        new Evento(4, diasDesdeHoy(24), "22:00", "05:00", 180, 180, "Cierre de Mes", 12000, [1, 2, 3, 5],
            "Cuatro DJs, dos pisos y barra extendida para despedir el mes.")
    ];

    const items = [
        new ItemMenu(1, "Negroni de la casa", "Gin, vermut rosso y Campari con naranja ahumada.", 7500, "Cocktails"),
        new ItemMenu(2, "Pisco Sour", "Pisco, limón, almíbar y clara de huevo.", 7000, "Cocktails"),
        new ItemMenu(3, "Mezcal Mule", "Mezcal, jengibre, lima y soda.", 8000, "Cocktails"),
        new ItemMenu(4, "IPA artesanal", "Pinta de cerveza lupulada de productor local.", 5500, "Cervezas"),
        new ItemMenu(5, "Honey", "Pinta de cerveza dorada suave.", 5000, "Cervezas"),
        new ItemMenu(6, "Malbec", "Copa de tinto mendocino.", 6000, "Vinos"),
        new ItemMenu(7, "Torrontés", "Copa de blanco aromático salteño.", 6000, "Vinos"),
        new ItemMenu(8, "Mocktail de frutos rojos", "Frutos rojos, menta, limón y soda.", 4500, "Sin alcohol"),
        new ItemMenu(9, "Limonada de jengibre", "Limón exprimido, jengibre y hielo.", 4000, "Sin alcohol"),
        new ItemMenu(10, "Papas rústicas", "Con alioli de ajo asado y pimentón ahumado.", 6500, "Comida"),
        new ItemMenu(11, "Tabla de quesos y fiambres", "Selección para compartir entre dos o tres.", 14000, "Comida"),
        new ItemMenu(12, "Empanadas de carne (x3)", "Cortada a cuchillo, al horno de barro.", 7000, "Comida"),
        new ItemMenu(13, "Hummus con vegetales", "Hummus de garbanzos, crudités y pan de pita.", 6000, "Comida")
    ];

    let idCancion = 1;
    const cancion = (titulo, artista, duracion) => new Cancion(idCancion++, titulo, artista, duracion);

    const playlists = [
        new Playlist(1, "Esenciales de Bonobo", 1, [
            cancion("Kerala", "Bonobo", "03:58"),
            cancion("Cirrus", "Bonobo", "05:52"),
            cancion("Kong", "Bonobo", "03:58"),
            cancion("Black Sands", "Bonobo", "06:49")
        ]),
        new Playlist(2, "Atardecer con Tycho", 2, [
            cancion("Awake", "Tycho", "04:43"),
            cancion("A Walk", "Tycho", "05:16"),
            cancion("Dive", "Tycho", "08:19")
        ]),
        new Playlist(3, "Space Is Only Noise", 3, [
            cancion("Space Is Only Noise If You Can See", "Nicolas Jaar", "04:35"),
            cancion("Mi Mujer", "Nicolas Jaar", "06:52"),
            cancion("Colomb", "Nicolas Jaar", "03:26")
        ]),
        new Playlist(4, "Dub de medianoche", 4, [
            cancion("Lebanese Blonde", "Thievery Corporation", "04:48"),
            cancion("The Richest Man in Babylon", "Thievery Corporation", "03:42"),
            cancion("Amerimacka", "Thievery Corporation", "05:30")
        ]),
        new Playlist(5, "Verano eterno", 5, [
            cancion("Feel It All Around", "Washed Out", "03:11"),
            cancion("Amor Fati", "Washed Out", "04:26"),
            cancion("It All Feels Right", "Washed Out", "04:13")
        ]),
        new Playlist(6, "Entre el folk y la pista", 6, [
            cancion("Baby", "Four Tet", "04:02"),
            cancion("Two Thousand and Seventeen", "Four Tet", "04:07"),
            cancion("Angel Echoes", "Four Tet", "04:00")
        ])
    ];

    return {
        djs,
        eventos,
        items,
        playlists,
        clientes: [],
        reservas: [],
        recomendaciones: [],
        // Próximo ID a asignar en cada colección.
        counters: {
            djs: djs.length + 1,
            eventos: eventos.length + 1,
            items: items.length + 1,
            playlists: playlists.length + 1,
            canciones: idCancion,
            clientes: 1,
            reservas: 1,
            entradas: 1,
            recomendaciones: 1
        }
    };
}
