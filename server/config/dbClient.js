
import 'dotenv/config'
import mongoose from "mongoose";

class DbClient {
    constructor() {
        this.connectDB()
    }
    async connectDB() {
        try {
            // Using direct cluster endpoints to bypass Node.js local DNS SRV "ECONNREFUSED" resolution issues on Windows

            const queryString = `mongodb://${process.env.USER_DB}:${process.env.DB_PASSWORD}@${process.env.FALLBACK}/?tls=true&replicaSet=${process.env.REPLICA_SET}&authSource=admin&retryWrites=true&w=majority&appName=Gym`;
            await mongoose.connect(queryString, { dbName: 'GymSaaS' })
            console.log("Connected to MongoDB")
        } catch (e) {
            console.log(e)
        }
    }

    async disconnectDB() {
        try {
            await mongoose.disconnect()
            console.log("Disconnected from MongoDB")
        } catch (e) {
            console.log(e)
        }
    }
}

export default new DbClient();

