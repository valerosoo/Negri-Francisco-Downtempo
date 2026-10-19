import { Router } from "express";
import djController from "../controllers/DJController.js";
import { validateId } from "../middlewares/validateId.js";
import { validateDJ } from "../middlewares/validateDJ.js";

const router = Router();

router.get("/", djController.getAll);
router.get("/:id", validateId, djController.getById);
router.post("/", validateDJ, djController.create);
router.put("/:id", validateId, validateDJ, djController.update);
router.delete("/:id", validateId, djController.delete);

export default router;
