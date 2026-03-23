import mongoose from "mongoose";

const checkinSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan"
        
    },
    status: {
        type: String,
        enum: ["permitido", "denegado"],
        default: "permitido"
    },
    deniedReason: {
        type: String,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Checkin", checkinSchema)