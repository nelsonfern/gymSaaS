import mongoose from "mongoose";

const checkinSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Checkin", checkinSchema)