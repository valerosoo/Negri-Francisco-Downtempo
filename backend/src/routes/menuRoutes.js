import { Router } from "express";
import menuController from "../controllers/MenuController.js";

const router = Router();

router.get("/", menuController.getAll);

export default router;
