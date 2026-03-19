import mongoose from "mongoose";
import Plan from "../schemas/plan.js";

export class PlanModel {
    static async createPlan(plan) {
        return await Plan.create(plan)
    }
    static async getPlans() {
        // Solo obtener los planes que estén activos
        return await Plan.find({ isActive: true })
    }
    static async getPlanById(id) {
        return await Plan.findOne({ _id: new mongoose.Types.ObjectId(id) })
    }
    static async updatePlan(id, plan) {
        return await Plan.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { $set: plan }, { new: true, runValidators: true })
    }
    static async deletePlan(id) {
        // En lugar de findOneAndDelete, hacemos un soft-delete
        return await Plan.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { isActive: false }, { new: true })
    }
}