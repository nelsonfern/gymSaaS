import express from 'express'
import { ClientModel } from '../models/client.js'
import { PlanModel } from '../models/plan.js'
import Client from '../schemas/client.js'
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
                return res.status(409).json({
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
            const allowedUpdates = ["name", "lastName", "phone", "dni", "email"]

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
    //separar clients de las stats para paginacion y mas rendimiento
    static async getClientsStats(req, res) {
        try {
            const totalClients = await ClientModel.countClients()
            const activeClients = await ClientModel.countActiveClients()
            const expiredClients = await ClientModel.countExpiredClients()
            const expiringSoonClients = await ClientModel.getClientsExpiringSoon()
            const newsThisMonthClients = await ClientModel.getClientsNewsThisMonth()
            // on plans id put the name of the plan
        

            res.status(200).json({ totalClients, activeClients, expiredClients, expiringSoonClients, newsThisMonthClients })
        } catch (e) {
            res.status(500).json({ message: e })
            console.log(e)
        }
    }
    //hacer un get clients con paginacion
    static async getClients(req, res) {
  try {
    const search = req.query.search || "";

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { dni: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    if (req.query.page && req.query.limit) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const data = await ClientModel.getClients({ skip, limit, query });
      const total = await Client.countDocuments(query);

      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        data,
        total,
        page,
        limit,
        totalPages
      });
    }

    // 🔹 sin paginación
    const data = await ClientModel.getClients({ query });
    const total = data.length;

    return res.status(200).json({
      data,
      total,
      page: 1,
      limit: total,
      totalPages: 1
    });

  } catch (e) {
    res.status(500).json({ message: e.message || 'Error fetching clients' });
    console.log(e);
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
    static async getClientStatusByDni(req, res) {
        try {
            const client = await ClientModel.getClientByDni(req.params.dni)

            if (!client) {
                return res.status(404).json({ message: "Cliente no encontrado" })
            }

            const now = new Date()

            const daysLeft = client.membershipEnd
                ? Math.ceil((client.membershipEnd - now) / (1000 * 60 * 60 * 24))
                : 0

            const status = client.membershipEnd >= now ? "active" : "expired"

            res.json({
                name: client.name,
                status,
                daysLeft
            })

        } catch {
            res.status(500).json({ message: "Error" })
        }
    }

    static async getClientByDni(req, res) {
        try {
            const client = await ClientModel.getClientByDni(req.params.dni)
            if (!client) {
                return res.status(404).json({ message: "Cliente no encontrado" })
            }
            res.status(200).json(client)
        } catch {
            res.status(500).json({ message: "Error" })
        }
    }
}

