import { Router } from "express";
import reservaController from "../controllers/ReservaController.js";
import { validateId } from "../middlewares/validateId.js";
import { validateReserva } from "../middlewares/validateReserva.js";

const router = Router();

router.get("/:id", validateId, reservaController.getById);
router.post("/", validateReserva, reservaController.create);

export default router;
