import { Router } from "express";
import reservaController from "../controllers/ReservaController.js";
import { validateId } from "../middlewares/validateId.js";
import { validateReserva, validateEmailQuery } from "../middlewares/validateReserva.js";

const router = Router();

router.get("/", validateEmailQuery, reservaController.getByEmail);
router.get("/:id", validateId, reservaController.getById);
router.post("/", validateReserva, reservaController.create);
router.delete("/:id", validateId, validateEmailQuery, reservaController.cancel);

export default router;
