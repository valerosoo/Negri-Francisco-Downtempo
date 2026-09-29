import { Router } from "express";
import djRoutes from "./djRoutes.js";

const router = Router();

router.use("/djs", djRoutes);

export default router;
