import mongoose from "mongoose";
import Checkin from "../schemas/checkin.js";

export class CheckinModel {
    static async createCheckin(data) {
        return await Checkin.create(data)
    }
    static async getCheckins() {
        return await Checkin.find().populate('client')
    }
    static async getCheckinsByClient(clientId) {
        return await Checkin.find({ client: new mongoose.Types.ObjectId(clientId) })
    }
    static async countCheckinsByClient(clientId, startOfDay, endOfDay) {
        return await Checkin.countDocuments({
            client: new mongoose.Types.ObjectId(clientId),
            date: { $gte: startOfDay, $lte: endOfDay }
        })
    }
    static async getTodayCheckins() {
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        return await Checkin.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        })
            .populate("client", "name lastName dni")
            .sort({ date: -1 })
    }
}