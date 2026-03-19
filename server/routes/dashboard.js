import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.js";
import { verificarToken, authorize } from "../helpers/auth.js";
const router = Router()

router.get("/", verificarToken, authorize(["admin", "staff"]), DashboardController.getDashboard)

export default router