import mongoose from 'mongoose'
import Client from '../schemas/client.js'

export class ClientModel {
    static async createClient(client) {
        return await Client.create(client)
    }
    static async getClients({ skip, limit, query = {}, status } = {}) {
        let mongoQuery = Client.find(query)
            .populate("plan", "name")
            .sort({ createdAt: -1 });

        if (skip !== undefined) mongoQuery = mongoQuery.skip(skip);
        if (limit !== undefined) mongoQuery = mongoQuery.limit(limit);
        if (status !== undefined) mongoQuery = mongoQuery.where("status").equals(status);
        return await mongoQuery;
    }
    static async getClientById(id) {

        return await Client.findOne({ delete: false, _id: new mongoose.Types.ObjectId(id)}).populate("plan", "name")
    }
    static async updateClient(id, client) {

        return await Client.findOneAndUpdate({ delete: false, _id: new mongoose.Types.ObjectId(id) }, { $set: client }, { new: true, runValidators: true })

    }

    static async deleteClient(id) {

        return await Client.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { $set: { delete: true } })

    }
    static async getClientByDni(dni) {
        return await Client.findOne({ delete: false, dni }).populate("plan", "name")
    }
    static async countClients() {
        return await Client.countDocuments({ delete: false })
    }
    static async countActiveClients() {
        return await Client.countDocuments({ delete: false, status: 'activo' })
    }
    static async countExpiredClients() {
        return await Client.countDocuments({ delete: false, status: { $in: ['vencido', 'sin_plan'] } })
    }
    static async getClientsExpiringSoon() {
        return await Client.countDocuments({ delete: false, status: 'vence_pronto' })
    }
    static async getClientsNewsThisMonth() {
        return await Client.countDocuments({ delete: false, createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } })
    }
}

