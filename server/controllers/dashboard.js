import { PaymentModel } from "../models/pago.js";
import { ClientModel } from "../models/client.js";
import { PlanModel } from "../models/plan.js";

export class DashboardController {
    static async getDashboard(req, res) {
        try {
            const now = new Date()

            const totalIncome = await PaymentModel.getPayments().aggregate([
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])

            const activeClients = await ClientModel.getClients().countDocuments({
                membershipEnd: { $gte: now }
            })

            const expiredClients = await ClientModel.getClients().countDocuments({
                membershipEnd: { $lt: now }
            })
            const monthlyIncome = await PaymentModel.getPayments().aggregate([
                {
                    $match: {
                        date: {
                            $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                            $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
                        }
                    }
                },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])
            res.json({
                totalIncome: totalIncome[0]?.total || 0,
                activeClients,
                expiredClients,
                monthlyIncome: monthlyIncome[0]?.total || 0
            })

        } catch {
            res.status(500).json({ message: "Error" })
        }
    }
}