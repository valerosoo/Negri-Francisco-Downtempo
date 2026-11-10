import { Router } from "express";
import menuController from "../controllers/MenuController.js";
import { validateId } from "../middlewares/validateId.js";
import { validateItemMenu } from "../middlewares/validateItemMenu.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/", menuController.getAll);
router.get("/:id", validateId, menuController.getById);
router.post("/", requireAdmin, validateItemMenu, menuController.create);
router.put("/:id", requireAdmin, validateId, validateItemMenu, menuController.update);
router.delete("/:id", requireAdmin, validateId, menuController.delete);

export default router;
