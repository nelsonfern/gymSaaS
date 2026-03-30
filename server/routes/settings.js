import express from "express";
import { SettingsController } from "../controllers/settings.js";
import { verificarToken, authorize } from "../helpers/auth.js";

export const settingsRoutes = express.Router()

settingsRoutes.get('/', verificarToken, authorize(["admin", "staff"]), SettingsController.getSettings)
settingsRoutes.put('/:id', verificarToken, authorize(["admin"]), SettingsController.updateSettings)