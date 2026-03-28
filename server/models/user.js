import mongoose from 'mongoose'
import User from '../schemas/user.js'

export class UserModel {
    static async createUser(user) {
        return await User.create(user)
    }
    static async getUsers() {
        return await User.find()
    }
    static async getUserById(id) {

        return await User.findOne({ _id: new mongoose.Types.ObjectId(id) })
    }
    static async getUser(filter) {
        return await User.findOne(filter)
    }
    static async updateUser(id, user) {

        return await User.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { $set: user }, { new: true, runValidators: true })

    }

    static async deleteUser(id) {

        return await User.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) })

    }
    static async saveRefreshToken(id, token) {
        return await User.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { $set: { refreshToken: token } }, { new: true, runValidators: true })
    }
    static async removeRefreshToken(id) {
        return await User.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { $set: { refreshToken: null } }, { new: true, runValidators: true })
    }
}

