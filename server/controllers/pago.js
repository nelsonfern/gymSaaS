import { PaymentModel } from '../models/pago.js'
import { ClientModel } from '../models/client.js'
import { PlanModel } from '../models/plan.js'
import Payment from '../schemas/pago.js'
export class PaymentController {

    static async createPayment(req, res) {
        try {
            const { client, plan, amount, method } = req.body

            // 1️⃣ validar que existan
            const clientExists = await ClientModel.getClientById(client)
            const planExists = await PlanModel.getPlanById(plan)
            const planPrice = planExists.price
            if (!clientExists || !planExists) {
                return res.status(400).json({
                    message: "Cliente o plan no existe"
                })
            }
            if(amount !== planPrice){
                return res.status(400).json({
                    message: "El monto no coincide con el precio del plan"
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
            let membershipStart = now

            if (clientExists.membershipEnd && clientExists.membershipEnd > now) {
                // Si la membresía sigue activa, sumamos los días a partir de su último vencimiento
                startDate = clientExists.membershipEnd
                // Conservamos el inicio de membresía original
                membershipStart = clientExists.membershipStart || now
            }
            const endDate = new Date(startDate)
            endDate.setDate(startDate.getDate() + planExists.durationDays)

            await ClientModel.updateClient(client, {
                plan,
                membershipStart,
                membershipEnd: endDate,
                status: 'active'
            })

            res.status(201).json(payment)

        } catch (e) {
            //manejar errores de falta de datos
            if (e.name === "ValidationError") {
                const errors = Object.values(e.errors).map(err => err.message)
                return res.status(400).json({ error: errors })
            }
            if (e.code === 11000) {
                return res.status(400).json({ error: "El pago ya existe" })
            }
            const error = e.message || "Error interno del servidor"
            res.status(500).json({ message: error})
        }
    }
    static async getPayments(req, res) {
        try {
            const search = req.query.search || "";

            const query = search
                ? {
                    $or: [
                        { client: { $regex: search, $options: "i" } },
                        { plan: { $regex: search, $options: "i" } },
                        { amount: { $regex: search, $options: "i" } },
                        { method: { $regex: search, $options: "i" } }
                    ]
                }
                : {};

            if (req.query.page && req.query.limit) {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const skip = (page - 1) * limit;

                const data = await PaymentModel.getPayments({ skip, limit, query });
                const total = await Payment.countDocuments(query);

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
            const data = await PaymentModel.getPayments({ query });
            const total = data.length;

            return res.status(200).json({
                data,
                total,
                page: 1,
                limit: total,
                totalPages: 1
            });

        } catch (e) {
            res.status(500).json({ message: "Error" })
        }
    }
    static async getPaymentsByClient(req, res) {
        try {
            const { clientId: id } = req.params
            const payments = await PaymentModel.getPaymentsByClient(id)
            if (!payments) {
                return res.status(404).json({ message: "No se encontraron pagos para el cliente" })
            }
            res.json(payments)

        } catch {
            res.status(500).json({ message: "Error" })
        }
    }
    static async getTotalPayments(req, res) {
        try {
            const total = await PaymentModel.totalPayments()
            const totalMonth = await PaymentModel.totalPaymentsMonth()
            const totalYear = await PaymentModel.totalPaymentsYear()
            res.json({total, totalMonth, totalYear})
        } catch {
            res.status(500).json({ message: "Error" })
        }
    }
    

}