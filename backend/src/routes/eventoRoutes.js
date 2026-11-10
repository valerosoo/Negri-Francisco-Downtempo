import { Router } from "express";
import eventoController from "../controllers/EventoController.js";
import { validateId } from "../middlewares/validateId.js";
import { validateEvento, validateEventoQuery } from "../middlewares/validateEvento.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/", validateEventoQuery, eventoController.getAll);
router.get("/:id", validateId, eventoController.getById);
router.post("/", requireAdmin, validateEvento, eventoController.create);
router.put("/:id", requireAdmin, validateId, validateEvento, eventoController.update);
router.delete("/:id", requireAdmin, validateId, eventoController.delete);

export default router;
