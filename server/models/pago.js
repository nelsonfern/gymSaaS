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

    static async getPaymentAnalytics() {
        const now = new Date()
        
        // Obtenemos los últimos 30 días
        const last30Days = new Date()
        last30Days.setDate(last30Days.getDate() - 30)
        
        // Fechas para comparar el mes actual vs el mes pasado
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

        // Ejecutamos las 7 consultas de agregación EN PARALELO
        const [
            totalIncomeRaw,
            totalIncomeYearRaw,
            revenueByDayRaw,
            revenueByMethodRaw,
            revenueByPlanRaw,
            kpiThisMonthRaw,
            kpiLastMonthRaw
        ] = await Promise.all([
            // 1. Total Ingresos historico
            PaymentModel.totalPayments(),
            PaymentModel.totalPaymentsYear(),
            // 2. Ingresos por día (Últimos 30 días)
            Payment.aggregate([
                { $match: { createdAt: { $gte: last30Days } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        total: { $sum: "$amount" }
                    }
                },
                { $sort: { "_id": 1 } }
            ]),

            // 2. Ingresos por Método de Pago (Últimos 30 días)
            Payment.aggregate([
                { $match: { createdAt: { $gte: last30Days } } },
                {
                    $group: {
                        _id: "$method",
                        total: { $sum: "$amount" }
                    }
                }
            ]),

            // 3. Ingresos por Plan (Últimos 30 días)
            Payment.aggregate([
                { $match: { createdAt: { $gte: last30Days } } },
                {
                    $lookup: {
                        from: "plans", // colección 'plans' en MongoDB
                        localField: "plan",
                        foreignField: "_id",
                        as: "planDetails"
                    }
                },
                { $unwind: "$planDetails" },
                {
                    $group: {
                        _id: "$planDetails.name",
                        total: { $sum: "$amount" }
                    }
                }
            ]),

            // 4. KPI Mes Actual
            Payment.aggregate([
                { $match: { createdAt: { $gte: startOfThisMonth } } },
                { $group: { _id: null, total: { $sum: "$amount" }, discounts: { $sum: "$discount" } } }
            ]),

            // 5. KPI Mes Pasado
            Payment.aggregate([
                { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])
        ]);

        // Formateo final de las matemáticas calculadas por Mongo
        const totalThisMonth = kpiThisMonthRaw[0]?.total || 0;
        const discountsThisMonth = kpiThisMonthRaw[0]?.discounts || 0;
        const totalLastMonth = kpiLastMonthRaw[0]?.total || 0;
        
        let growth = 0;
        if (totalLastMonth > 0) {
            growth = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100;
        } else if (totalThisMonth > 0) {
            growth = 100;
        }

        return {
            revenueByDay: revenueByDayRaw.map(r => ({ date: r._id, total: r.total })),
            revenueByMethod: revenueByMethodRaw.map(r => ({ name: r._id, total: r.total })),
            revenueByPlan: revenueByPlanRaw.map(r => ({ name: r._id, total: r.total })),
            kpis: {
                totalThisMonth,
                totalLastMonth,
                totalIncome: totalIncomeRaw[0]?.total || 0,
                totalIncomeYear: totalIncomeYearRaw[0]?.total || 0,
                growthPercentage: parseFloat(growth.toFixed(2)),
                discountsThisMonth
            }
        };
    }
}