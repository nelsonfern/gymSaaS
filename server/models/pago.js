import Payment from '../schemas/pago.js'
import mongoose from 'mongoose'

export class PaymentModel {
    static async createPayment(data) {
        return await Payment.create(data)
    }

    static async getPayments() {
        return await Payment.find().populate('client plan')
    }

    static async getPaymentsByClient(clientId) {
        return await Payment.find({ client: new mongoose.Types.ObjectId(clientId) })
    }
}