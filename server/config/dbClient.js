
import 'dotenv/config'
import mongoose from "mongoose";

class DbClient {
    constructor() {
        this.connectDB()
    }
    async connectDB() {
        try {
            // Using direct cluster endpoints to bypass Node.js local DNS SRV "ECONNREFUSED" resolution issues on Windows

            const queryString = `${process.env.MONGO_URI}`;
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

