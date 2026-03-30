import express from "express";
import { CheckinController } from "../controllers/checkin.js";
import { verificarToken, authorize } from "../helpers/auth.js";
export const checkinRoutes = express.Router()
checkinRoutes.get("/", verificarToken, authorize(["admin", "staff"]), CheckinController.getCheckins)
checkinRoutes.post("/", verificarToken, authorize(["admin", "staff"]), CheckinController.checkinByDni)

checkinRoutes.get(
    "/today",
    verificarToken,
    authorize(["admin", "staff"]),
    CheckinController.getTodayCheckins
)

checkinRoutes.get("/:clientId", verificarToken, authorize(["admin", "staff"]), CheckinController.getClientCheckins)
