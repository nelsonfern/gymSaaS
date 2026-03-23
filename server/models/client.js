import mongoose from 'mongoose'
import Client from '../schemas/client.js'

export class ClientModel {
    static async createClient(client) {
        return await Client.create(client)
    }
    static async getClients({ skip, limit, query = {} } = {}) {
        let mongoQuery = Client.find(query)
            .populate("plan", "name")
            .sort({ createdAt: -1 });

        if (skip !== undefined) mongoQuery = mongoQuery.skip(skip);
        if (limit !== undefined) mongoQuery = mongoQuery.limit(limit);

        return await mongoQuery;
    }
    static async getClientById(id) {

        return await Client.findOne({ _id: new mongoose.Types.ObjectId(id) }).populate("plan", "name")
    }
    static async updateClient(id, client) {

        return await Client.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { $set: client }, { new: true, runValidators: true })

    }

    static async deleteClient(id) {

        return await Client.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) })

    }
    static async getClientByDni(dni) {
        return await Client.findOne({ dni })
    }
    static async countClients() {
        return await Client.countDocuments()
    }
    static async countActiveClients() {
        return await Client.countDocuments({ status: 'active' })
    }
    static async countExpiredClients() {
        return await Client.countDocuments({ status: 'expired' })
    }
    static async getClientsExpiringSoon() {
        return await Client.countDocuments({ status: 'active', membershipEnd: { $lt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) } })
    }
    static async getClientsNewsThisMonth() {
        return await Client.countDocuments({ createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } })
    }
}

