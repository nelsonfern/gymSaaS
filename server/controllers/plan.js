import { PlanModel } from "../models/plan.js";

export class PlanController {
    constructor() { }

    static async createPlan(req, res) {
        try {
            const { name, price, durationDays, description } = req.body
            const plan = await PlanModel.createPlan({ name, price, durationDays, description })
            res.status(201).json(plan)
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({
                    error: "El plan ya existe"
                })
            }
            if (error.name === "ValidationError") {
                const errors = Object.values(error.errors).map(err => err.message)
                return res.status(400).json({
                    error: errors
                })
            }
            if (error.name === "CastError") {
                return res.status(400).json({
                    error: "Tipo de dato inválido"
                })
            }


            res.status(500).json({ error: "Error interno del servidor" })
        }
    }
    static async getPlans(req, res) {
        try {
            const data = await PlanModel.getPlans()
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    static async getPlanById(req, res) {
        try {
            const data = await PlanModel.getPlanById(req.params.id)
            if (!data) {
                return res.status(404).json({
                    message: "Plan no encontrado"
                })
            }
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    static async updatePlan(req, res) {
        try {
            const data = await PlanModel.updatePlan(req.params.id, req.body)
            if (!data) {
                return res.status(404).json({
                    message: "Plan no encontrado"
                })
            }
            res.status(200).json(data)
        } catch (error) {
            if (error.name === "ValidationError") {
                const errors = Object.values(error.errors).map(err => err.message)
                return res.status(400).json({
                    error: errors
                })
            }
            res.status(500).json({ error: "Error interno del servidor" })
        }
    }
    static async deletePlan(req, res) {
        try {
            const data = await PlanModel.deletePlan(req.params.id)
            if (!data) {
                return res.status(404).json({
                    message: "Plan no encontrado"
                })
            }
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}