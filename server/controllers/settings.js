import { SettingsModel } from "../models/settings.js";

export class SettingsController {
    constructor() { }

    static async getSettings(req, res) {
        try {
            let data = await SettingsModel.getSettings()
            
            // Si la base de datos está vacía, creamos los settings por defecto automáticamente
            if (!data) {
                data = await SettingsModel.createSettings({})
            }
            
            res.status(200).json({success: true, settings: data})
        } catch (e) {
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async updateSettings(req, res) {
        try {
            const data = await SettingsModel.updateSettings(req.params.id, req.body)
            if (!data) {
                return res.status(404).json({ message: "Settings no encontrado" })
            }
            res.status(200).json({success: true, settings: data})
        } catch (e) {
            if (e.name === "CastError") {
                return res.status(400).json({ message: "ID de settings inválido" })
            }
            if (e.name === "ValidationError") {
                const errors = Object.values(e.errors).map(err => err.message)
                return res.status(400).json({ message: "Datos inválidos", errors })
            }
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }
}