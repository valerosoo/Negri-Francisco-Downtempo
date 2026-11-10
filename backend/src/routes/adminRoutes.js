import { Router } from "express";
import adminController from "../controllers/AdminController.js";
import reservaController from "../controllers/ReservaController.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.use(requireAdmin);

router.post("/login", adminController.login);
router.get("/reservas", reservaController.getAll);

export default router;
