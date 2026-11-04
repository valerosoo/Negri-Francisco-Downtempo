import ItemMenu from "../models/ItemMenu.js";

// Persistencia temporal en memoria
const items = [
    new ItemMenu(1, "Negroni de la casa", "Gin, vermut rosso y Campari con naranja ahumada.", 7500, "Cocktails"),
    new ItemMenu(2, "Pisco Sour", "Pisco, limón, almíbar y clara de huevo.", 7000, "Cocktails"),
    new ItemMenu(3, "Mezcal Mule", "Mezcal, jengibre, lima y soda.", 8000, "Cocktails"),
    new ItemMenu(4, "IPA artesanal", "Pinta de cerveza lupulada de productor local.", 5500, "Cervezas"),
    new ItemMenu(5, "Honey", "Pinta de cerveza dorada suave.", 5000, "Cervezas"),
    new ItemMenu(6, "Malbec", "Copa de tinto mendocino.", 6000, "Vinos"),
    new ItemMenu(7, "Torrontés", "Copa de blanco aromático salteño.", 6000, "Vinos"),
    new ItemMenu(8, "Mocktail de frutos rojos", "Frutos rojos, menta, limón y soda.", 4500, "Sin alcohol"),
    new ItemMenu(9, "Limonada de jengibre", "Limón exprimido, jengibre y hielo.", 4000, "Sin alcohol")
];

class MenuRepository {
    findAll() {
        return items;
    }
}

export default new MenuRepository();
