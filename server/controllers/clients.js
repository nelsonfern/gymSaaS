import express from 'express'
import { ClientModel } from '../models/client.js'
import { PlanModel } from '../models/plan.js'

export class ClientController {
    //manejo de errores en el create, validaciones de required de mongoose

    static async createClient(req, res) {
        try {
            const data = await ClientModel.createClient(req.body)

            res.status(201).json(data)

        } catch (e) {
            if (e.name === "ValidationError") {
                const errors = Object.values(e.errors).map(err => err.message)

                return res.status(400).json({
                    error: errors
                })
            }
            if (e.code === 11000) {
                return res.status(400).json({
                    error: "El cliente ya existe"
                })
            }
            const planExists = await PlanModel.getPlanById(req.body.plan)
            if (!planExists) {
                return res.status(404).json({
                    message: "El plan especificado no existe"
                })
            }
            res.status(500).json({
                error: "Error interno del servidor"
            })
        }
    }
    static async updateClient(req, res) {
        try {
            const allowedUpdates = ["name", "lastName", "phone"]

            const updates = Object.keys(req.body)

            const isValid = updates.every(field => allowedUpdates.includes(field))

            if (!isValid) {
                return res.status(400).json({
                    message: "Campos no permitidos"
                })
            }

            const data = await ClientModel.updateClient(
                req.params.id,
                req.body
            )

            if (!data) {
                return res.status(404).json({
                    message: "Cliente no encontrado"
                })
            }

            res.status(200).json(data)

        } catch (e) {
            res.status(500).json({ message: "Internal server error" })
        }
    }

    static async updateClientPlan(req, res) {
        try {
            const { plan } = req.body

            if (!plan) {
                return res.status(400).json({
                    message: "El plan es requerido"
                })
            }

            // Buscamos el plan para obtener sus días de duración
            const planData = await PlanModel.getPlanById(plan)
            if (!planData) {
                return res.status(404).json({
                    message: "El plan especificado no existe"
                })
            }

            // Calculamos las fechas
            const membershipStart = new Date()
            const membershipEnd = new Date()
            membershipEnd.setDate(membershipEnd.getDate() + planData.durationDays)

            const client = await ClientModel.updateClient(
                req.params.id,
                {
                    plan: planData._id,
                    membershipStart,
                    membershipEnd,
                    status: 'active'
                }
            )

            if (!client) {
                return res.status(404).json({
                    message: "Cliente no encontrado"
                })
            }

            res.status(200).json(client)

        } catch (e) {
            console.error(e) // Opcional, pero útil para depuración
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    static async deleteClient(req, res) {
        try {
            const data = await ClientModel.deleteClient(req.params.id)

            if (!data) {
                return res.status(404).json({ message: "Cliente no encontrado" })
            }

            res.status(200).json({ message: "Cliente eliminado" })

        } catch (e) {
            res.status(500).json({ message: "Internal server error" })
        }
    }
    static async getClients(req, res) {
        try {
            const data = await ClientModel.getClients()
            res.status(200).json(data)
        } catch (e) {
            res.status(500).json({ message: "Internal server error" })
        }
    }
    static async getClientById(req, res) {
        try {
            const data = await ClientModel.getClientById(req.params.id)

            if (!data) {
                return res.status(404).json({ message: "Cliente no encontrado" })
            }

            res.status(200).json(data)

        } catch (e) {
            res.status(500).json({ message: "Internal server error" })
        }
    }
}

