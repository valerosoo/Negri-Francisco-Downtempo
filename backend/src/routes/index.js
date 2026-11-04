import { Router } from "express";
import djRoutes from "./djRoutes.js";
import eventoRoutes from "./eventoRoutes.js";
import reservaRoutes from "./reservaRoutes.js";
import menuRoutes from "./menuRoutes.js";

const router = Router();

router.use("/djs", djRoutes);
router.use("/eventos", eventoRoutes);
router.use("/reservas", reservaRoutes);
router.use("/menu", menuRoutes);

export default router;
