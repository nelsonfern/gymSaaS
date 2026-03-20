import mongoose from 'mongoose'
import Client from '../schemas/client.js'

export class ClientModel {
    static async createClient(client) {
        return await Client.create(client)
    }
    static async getClients() {
        return await Client.find()
    }
    static async getClientById(id) {

        return await Client.findOne({ _id: new mongoose.Types.ObjectId(id) })
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

}

