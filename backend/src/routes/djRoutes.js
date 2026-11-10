import { Router } from "express";
import djController from "../controllers/DJController.js";
import { validateId } from "../middlewares/validateId.js";
import { validateDJ } from "../middlewares/validateDJ.js";
import { validateRecomendacion } from "../middlewares/validateRecomendacion.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/", djController.getAll);
router.get("/:id", validateId, djController.getById);
// El alta es pública: es el formulario "¿Sos DJ?" del sitio.
router.post("/", validateDJ, djController.create);
router.put("/:id", requireAdmin, validateId, validateDJ, djController.update);
router.delete("/:id", requireAdmin, validateId, djController.delete);

router.post("/:id/like", validateId, djController.like);
router.get("/:id/playlists", validateId, djController.getPlaylists);
router.get("/:id/similares", validateId, djController.getSimilares);
router.get("/:id/recomendaciones", validateId, djController.getRecomendaciones);
router.post("/:id/recomendaciones", validateId, validateRecomendacion, djController.createRecomendacion);

export default router;
