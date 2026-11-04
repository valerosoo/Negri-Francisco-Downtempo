import { Router } from "express";
import eventoController from "../controllers/EventoController.js";
import { validateId } from "../middlewares/validateId.js";
import { validateEvento } from "../middlewares/validateEvento.js";

const router = Router();

router.get("/", eventoController.getAll);
router.get("/:id", validateId, eventoController.getById);
router.post("/", validateEvento, eventoController.create);
router.put("/:id", validateId, validateEvento, eventoController.update);
router.delete("/:id", validateId, eventoController.delete);

export default router;
