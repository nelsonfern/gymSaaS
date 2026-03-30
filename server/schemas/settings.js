import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    gymName: {type: String, default: "Mi Gym"},
    logoUrl: {type: String, default: ""},
    currencySymbol: {type: String, default: "$"},
    whatsappNumber: {type: String, default: ""},
    email: {type: String, default: ""},
    address: {type: String, default: ""},  
}, {timestamps: true});
 
export default mongoose.model("Settings", settingsSchema)