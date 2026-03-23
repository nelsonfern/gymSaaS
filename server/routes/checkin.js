import express from "express";
import { CheckinController } from "../controllers/checkin.js";
import { verificarToken, authorize } from "../helpers/auth.js";
export const checkinRoutes = express.Router()

checkinRoutes.post("/", verificarToken, authorize(["admin", "trainer"]), CheckinController.checkinByDni)

checkinRoutes.get(
    "/today",
    verificarToken,
    authorize(["admin", "trainer"]),
    CheckinController.getTodayCheckins
)

checkinRoutes.get("/:clientId", verificarToken, authorize(["admin", "trainer"]), CheckinController.getClientCheckins)
