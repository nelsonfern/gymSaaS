import { PaymentModel } from '../models/pago.js'
import { ClientModel } from '../models/client.js'
import { PlanModel } from '../models/plan.js'

export class PaymentController {

    static async createPayment(req, res) {
        try {
            const { client, plan, amount, method } = req.body

            // 1️⃣ validar que existan
            const clientExists = await ClientModel.getClientById(client)
            const planExists = await PlanModel.getPlanById(plan)

            if (!clientExists || !planExists) {
                return res.status(400).json({
                    message: "Cliente o plan no existe"
                })
            }

            // 2️⃣ crear pago
            const payment = await PaymentModel.createPayment({
                client,
                plan,
                amount,
                method
            })

            // 3️⃣ actualizar membresía 🔥
            const now = new Date()
            let startDate = now

            if (clientExists.membershipEnd && clientExists.membershipEnd > now) {
                startDate = clientExists.membershipEnd
            }
            const endDate = new Date(startDate)
            endDate.setDate(startDate.getDate() + planExists.durationDays)

            await ClientModel.updateClient(client, {
                plan,
                membershipStart: startDate,
                membershipEnd: endDate
            })

            res.status(201).json(payment)

        } catch (e) {
            res.status(500).json({ message: "Error interno" })
        }
    }
    static async getPayments(req, res) {
        try {
            const payments = await PaymentModel.getPayments()
            res.json(payments)
        } catch {
            res.status(500).json({ message: "Error" })
        }
    }
    static async getPaymentsByClient(req, res) {
        try {
            const payments = await PaymentModel.getPaymentsByClient(req.params.id)
            res.json(payments)
        } catch {
            res.status(500).json({ message: "Error" })
        }
    }
}