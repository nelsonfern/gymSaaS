import { ClientModel } from "../models/client.js";
import { CheckinModel } from "../models/checkin.js";

export class CheckinController {
    static async checkinByDni(req, res) {
        try {
            const { dni } = req.body

            if (!dni) {
                return res.status(400).json({ message: "El DNI es requerido" })
            }

            // Sanitizamos asegurando que sea un string limpio y sin espacios accidentales
            const cleanDni = String(dni).trim()

            const client = await ClientModel.getClientByDni(cleanDni)

            if (!client) {
                return res.status(404).json({ message: "Cliente no encontrado" })
            }

            const now = new Date()

            //  validar si tiene membresía asignada aún
            if (!client.membershipEnd) {
                return res.status(400).json({ message: "El cliente no cuenta con una membresía asignada" })
            }

            //  validar membresía vencida
            if (client.membershipEnd < now) {
                return res.status(400).json({ message: "Membresía vencida" })
            }

            // LÍMITE DE CHECK-INS 
            const startOfDay = new Date()
            startOfDay.setHours(0, 0, 0, 0)

            const endOfDay = new Date()
            endOfDay.setHours(23, 59, 59, 999)

            const count = await CheckinModel.countCheckinsByClient(client._id, startOfDay, endOfDay)

            if (count >= 3) {
                return res.status(400).json({
                    message: "Límite de ingresos alcanzado"
                })
            }

            // crear check-in
            await CheckinModel.createCheckin({ client: client._id })

            res.json({ message: "Ingreso registrado" })

        } catch {
            res.status(500).json({ message: "Error" })
        }
    }

    static async getClientCheckins(req, res) {
        try {
            const checkins = await CheckinModel.getCheckinsByClient(req.params.clientId)
            const sortedCheckins = checkins.sort((a, b) => b.date - a.date)
            res.json(sortedCheckins)

        } catch {
            res.status(500).json({ message: "Error" })
        }
    }
    static async getTodayCheckins(req, res) {
        try {
            const checkins = await CheckinModel.getTodayCheckins()

            res.json(checkins)

        } catch (e){
            console.log(e)
            res.status(500).json({ message: "Error" })
        }
    }
}