import { PaymentModel } from '../models/pago.js'
import { ClientModel } from '../models/client.js'
import { PlanModel } from '../models/plan.js'
import Payment from '../schemas/pago.js'
import { sendMail } from '../services/sendMail.js'
import { paymentTemplate } from '../services/emailTemplate.js'

export class PaymentController {

    static async createPayment(req, res) {
        try {
            const { client, plan, amount, method, note } = req.body

            if (!client || !plan || amount === undefined) {
                return res.status(400).json({ message: "client, plan y amount son requeridos" })
            }

            const clientExists = await ClientModel.getClientById(client)
            if (!clientExists) {
                return res.status(404).json({ message: "Cliente no encontrado" })
            }

            const planExists = await PlanModel.getPlanById(plan)
            if (!planExists) {
                return res.status(404).json({ message: "Plan no encontrado" })
            }

            const parsedAmount = Number(amount)
            const originalPrice = planExists.price

            if (parsedAmount <= 0) {
                return res.status(400).json({ message: "El monto debe ser mayor a 0" })
            }

            if (parsedAmount > originalPrice) {
                return res.status(400).json({ message: "El monto no puede ser mayor al precio del plan" })
            }

            const discount = originalPrice - parsedAmount

            const payment = await PaymentModel.createPayment({
                client,
                plan,
                amount: parsedAmount,
                originalPrice,
                discount,
                note: note?.trim() || '',
                method
            })

            const now = new Date()
            let startDate = now
            let membershipStart = now

            if (clientExists.membershipEnd && clientExists.membershipEnd > now) {
                startDate = clientExists.membershipEnd
                membershipStart = clientExists.membershipStart || now
            }

            const endDate = new Date(startDate)
            endDate.setDate(startDate.getDate() + planExists.durationDays)

            await ClientModel.updateClient(client, {
                plan,
                membershipStart,
                membershipEnd: endDate,
                expiringMailSent: false,
                status: 'activo'
            })

            if(clientExists?.allowEmail && clientExists?.email){
                await sendMail({
                    to: clientExists.email,
                    subject: "Comprobante de pago",
                    html: paymentTemplate({
                        name: clientExists.name,
                        amount: payment.amount,
                        planName: planExists.name,
                        paymentType: payment.method,
                        originalPrice: payment.originalPrice,
                        discount: payment.discount,
                        note: payment.note,
                        date: new Date().toLocaleDateString("es-AR")
                    })
                })
            }

            res.status(201).json(payment)

        } catch (e) {
            if (e.name === "ValidationError") {
                const errors = Object.values(e.errors).map(err => err.message)
                return res.status(400).json({ message: "Datos inválidos", errors })
            }
            if (e.name === "CastError") {
                return res.status(400).json({ message: "ID inválido" })
            }
            if (e.code === 11000) {
                return res.status(409).json({ message: "El pago ya existe" })
            }
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async getPayments(req, res) {
        try {
            const search = req.query.search || ""

            // client y plan son ObjectIds, no se pueden buscar con $regex directamente
            const query = {}

            if (req.query.page && req.query.limit) {
                const page = parseInt(req.query.page) || 1
                const limit = parseInt(req.query.limit) || 10
                const skip = (page - 1) * limit

                const data = await PaymentModel.getPayments({ skip, limit, query })
                const total = await Payment.countDocuments(query)
                const totalPages = Math.ceil(total / limit)

                return res.status(200).json({ data, total, page, limit, totalPages })
            }

            const data = await PaymentModel.getPayments({ query })
            const total = data.length

            return res.status(200).json({ data, total, page: 1, limit: total, totalPages: 1 })

        } catch (e) {
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async getPaymentsByClient(req, res) {
        try {
            const { clientId: id } = req.params
            const payments = await PaymentModel.getPaymentsByClient(id)

            if (!payments) {
                return res.status(404).json({ message: "Cliente no encontrado" })
            }

            res.status(200).json(payments)

        } catch (e) {
            if (e.name === "CastError") {
                return res.status(400).json({ message: "ID de cliente inválido" })
            }
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async getTotalPayments(req, res) {
        try {
            const total = await PaymentModel.totalPayments()
            const totalMonth = await PaymentModel.totalPaymentsMonth()
            const totalYear = await PaymentModel.totalPaymentsYear()
            res.status(200).json({ total, totalMonth, totalYear })
        } catch (e) {
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }
    static async getPaymentAnalytics(req, res) {
        try {
            const analytics = await PaymentModel.getPaymentAnalytics()
            res.status(200).json(analytics)
        } catch (e) {
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }
}