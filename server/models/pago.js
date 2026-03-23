import Payment from '../schemas/pago.js'
import Client from '../schemas/client.js'
import mongoose from 'mongoose'

export class PaymentModel {
    static async createPayment(data) {
        return await Payment.create(data)
    }

    static async getPayments({ skip, limit, query = {} } = {}) {
        let mongoQuery = Payment.find(query).populate('client plan').sort({ createdAt: -1 })
        if (skip !== undefined) mongoQuery = mongoQuery.skip(skip);
        if (limit !== undefined) mongoQuery = mongoQuery.limit(limit);
        return await mongoQuery
    }

    static async getPaymentsByClient(clientId) {
        const client = await Client.findById(clientId)
        if (!client) return null
        const payments = await Payment.find({ client: clientId }).populate('plan', 'name').sort({ createdAt: -1 })
        return payments
    }
    static async totalPayments() {
        return await Payment.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ])
    }
    static async totalPaymentsMonth() {
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        return await Payment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ])
    }
    static async totalPaymentsYear() {
        const startOfYear = new Date()
        startOfYear.setFullYear(startOfYear.getFullYear() - 1)
        return await Payment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfYear }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ])
    }
}