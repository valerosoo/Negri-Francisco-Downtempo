import { Router } from "express";
import entradaController from "../controllers/EntradaController.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/:codigo", entradaController.getByCodigo);
router.post("/:codigo/validar", requireAdmin, entradaController.validar);

export default router;
