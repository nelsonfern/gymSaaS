import { PlanModel } from "../models/plan.js";

export class PlanController {
    constructor() { }

    static async createPlan(req, res) {
        try {
            const { name, price, durationDays, description } = req.body
            const plan = await PlanModel.createPlan({ name, price, durationDays, description })
            res.status(201).json(plan)
        } catch (e) {
            if (e.code === 11000) {
                return res.status(409).json({ message: "El plan ya existe" })
            }
            if (e.name === "ValidationError") {
                const errors = Object.values(e.errors).map(err => err.message)
                return res.status(400).json({ message: "Datos inválidos", errors })
            }
            if (e.name === "CastError") {
                return res.status(400).json({ message: "Tipo de dato inválido" })
            }
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async getPlans(req, res) {
        try {
            const data = await PlanModel.getPlans()
            res.status(200).json(data)
        } catch (e) {
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async getPlanById(req, res) {
        try {
            const data = await PlanModel.getPlanById(req.params.id)
            if (!data) {
                return res.status(404).json({ message: "Plan no encontrado" })
            }
            res.status(200).json(data)
        } catch (e) {
            if (e.name === "CastError") {
                return res.status(400).json({ message: "ID de plan inválido" })
            }
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async updatePlan(req, res) {
        try {
            const data = await PlanModel.updatePlan(req.params.id, req.body)
            if (!data) {
                return res.status(404).json({ message: "Plan no encontrado" })
            }
            res.status(200).json(data)
        } catch (e) {
            if (e.name === "CastError") {
                return res.status(400).json({ message: "ID de plan inválido" })
            }
            if (e.name === "ValidationError") {
                const errors = Object.values(e.errors).map(err => err.message)
                return res.status(400).json({ message: "Datos inválidos", errors })
            }
            if (e.code === 11000) {
                return res.status(409).json({ message: "Ya existe un plan con ese nombre" })
            }
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async deletePlan(req, res) {
        try {
            const data = await PlanModel.deletePlan(req.params.id)
            if (!data) {
                return res.status(404).json({ message: "Plan no encontrado" })
            }
            res.status(200).json({ message: "Plan eliminado" })
        } catch (e) {
            if (e.name === "CastError") {
                return res.status(400).json({ message: "ID de plan inválido" })
            }
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }
}