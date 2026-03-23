import { ClientModel } from '../models/client.js'
import { PlanModel } from '../models/plan.js'
import Client from '../schemas/client.js'
import { getMembershipStatus, getDaysLeft } from '../utils/membershipStatus.js'

export class ClientController {

    static async createClient(req, res) {
        try {
            const data = await ClientModel.createClient(req.body)
            res.status(201).json(data)

        } catch (e) {
            if (e.name === "ValidationError") {
                const errors = Object.values(e.errors).map(err => err.message)
                return res.status(400).json({ message: "Datos inválidos", errors })
            }
            if (e.code === 11000) {
                return res.status(409).json({ message: "El cliente ya existe" })
            }
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async updateClient(req, res) {
        try {
            const allowedUpdates = ["name", "lastName", "phone", "dni", "email"]
            const updates = Object.keys(req.body)
            const isValid = updates.every(field => allowedUpdates.includes(field))

            if (!isValid) {
                return res.status(400).json({ message: "Campos no permitidos" })
            }

            const data = await ClientModel.updateClient(req.params.id, req.body)

            if (!data) {
                return res.status(404).json({ message: "Cliente no encontrado" })
            }

            res.status(200).json(data)

        } catch (e) {
            if (e.name === "CastError") {
                return res.status(400).json({ message: "ID de cliente inválido" })
            }
            if (e.name === "ValidationError") {
                const errors = Object.values(e.errors).map(err => err.message)
                return res.status(400).json({ message: "Datos inválidos", errors })
            }
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async updateClientPlan(req, res) {
        try {
            const { plan } = req.body

            if (!plan) {
                return res.status(400).json({ message: "El plan es requerido" })
            }

            const planData = await PlanModel.getPlanById(plan)
            if (!planData) {
                return res.status(404).json({ message: "El plan especificado no existe" })
            }

            const membershipStart = new Date()
            const membershipEnd = new Date()
            membershipEnd.setDate(membershipEnd.getDate() + planData.durationDays)

            const client = await ClientModel.updateClient(req.params.id, {
                plan: planData._id,
                membershipStart,
                membershipEnd,
                status: 'active'
            })

            if (!client) {
                return res.status(404).json({ message: "Cliente no encontrado" })
            }

            res.status(200).json(client)

        } catch (e) {
            if (e.name === "CastError") {
                return res.status(400).json({ message: "ID inválido" })
            }
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
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
            if (e.name === "CastError") {
                return res.status(400).json({ message: "ID de cliente inválido" })
            }
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async getClientsStats(req, res) {
        try {
            const totalClients = await ClientModel.countClients()
            const activeClients = await ClientModel.countActiveClients()
            const expiredClients = await ClientModel.countExpiredClients()
            const expiringSoonClients = await ClientModel.getClientsExpiringSoon()
            const newsThisMonthClients = await ClientModel.getClientsNewsThisMonth()

            res.status(200).json({
                totalClients,
                activeClients,
                expiredClients,
                expiringSoonClients,
                newsThisMonthClients
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

 static async getClients(req, res) {
  try {
    const { search = "", status, plan } = req.query;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { dni: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    if (req.query.page && req.query.limit) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      let data = await ClientModel.getClients({ skip, limit, query });

      // calcular daysLeft y status
      data = data.map((client) => {
        const daysLeft = getDaysLeft(client.membershipEnd);
        let clientStatus = "active";

        if (daysLeft === null) clientStatus = "no_membership";
        else if (daysLeft < 0) clientStatus = "expired";
        else if (daysLeft <= 3) clientStatus = "expiring_soon";

        return { ...client.toObject(), daysLeft, clientStatus };
      });

      // filtrar por status si existe
      if (status) {
        data = data.filter((c) => c.clientStatus === status);
      }

      // filtrar por plan si existe
      if (plan) {
        data = data.filter((c) => c.plan?.name === plan);
      }

      const total = await Client.countDocuments({delete: false, ...query});
      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({ data, total, page, limit, totalPages });
    }

    // Si no hay paginación
    let data = await ClientModel.getClients({ query });
    data = data.map((client) => {
      const daysLeft = getDaysLeft(client.membershipEnd);
      let clientStatus = "active";

      if (daysLeft === null) clientStatus = "no_membership";
      else if (daysLeft < 0) clientStatus = "expired";
      else if (daysLeft <= 3) clientStatus = "expiring_soon";

      return { ...client.toObject(), daysLeft, clientStatus };
    });

    if (status) data = data.filter((c) => c.clientStatus === status);
    if (plan) data = data.filter((c) => c.plan?.name === plan);

    const total = data.length;

    return res
      .status(200)
      .json({ data, total, page: 1, limit: total, totalPages: 1 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error interno del servidor" });
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
            if (e.name === "CastError") {
                return res.status(400).json({ message: "ID de cliente inválido" })
            }
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
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

            res.status(200).json({ name: client.name, status, daysLeft })

        } catch (e) {
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async getClientByDni(req, res) {
        try {
            const client = await ClientModel.getClientByDni(req.params.dni)

            if (!client) {
                return res.status(404).json({ message: "Cliente no encontrado" })
            }

            const now = new Date()
            const daysLeft = client.membershipEnd
                ? Math.ceil((new Date(client.membershipEnd) - now) / (1000 * 60 * 60 * 24))
                : null

            res.status(200).json({ ...client.toObject(), daysLeft })

        } catch (e) {
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }
}
