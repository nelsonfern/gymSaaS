import express from "express";
import { PlanController } from "../controllers/plan.js";
import { verificarToken, authorize } from "../helpers/auth.js";

export const planRoutes = express.Router()

planRoutes.get('/', PlanController.getPlans)
planRoutes.get('/:id', PlanController.getPlanById)
planRoutes.post('/', verificarToken, authorize(["admin"]), PlanController.createPlan)
planRoutes.put('/:id', verificarToken, authorize(["admin"]), PlanController.updatePlan)
planRoutes.delete('/:id', verificarToken, authorize(["admin"]), PlanController.deletePlan)