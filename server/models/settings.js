import mongoose from "mongoose";
import Settings from "../schemas/settings.js";

export class SettingsModel{
    static async createSettings(settings){
        return await Settings.create(settings)
    }   
    static async getSettings(){
        return await Settings.findOne()
    }
    static async updateSettings(id, settings){
        return await Settings.findByIdAndUpdate(id, settings, {new: true})
    }
}