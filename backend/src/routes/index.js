import { Router } from "express";
import djRoutes from "./djRoutes.js";
import eventoRoutes from "./eventoRoutes.js";
import reservaRoutes from "./reservaRoutes.js";
import entradaRoutes from "./entradaRoutes.js";
import menuRoutes from "./menuRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = Router();

router.use("/djs", djRoutes);
router.use("/eventos", eventoRoutes);
router.use("/reservas", reservaRoutes);
router.use("/entradas", entradaRoutes);
router.use("/menu", menuRoutes);
router.use("/admin", adminRoutes);

export default router;
