import { UserModel } from "../models/user.js";
import bcrypt from 'bcrypt'
import { generarToken } from "../helpers/auth.js";

export class UserController {
    constructor() { }

    static async register(req, res) {
        try {
            const { email, name, password, telefono } = req.body

            if (!email || !name || !password) {
                return res.status(400).json({ message: "email, name y password son requeridos" })
            }

            const userExiste = await UserModel.getUser({ email })
            if (userExiste) {
                return res.status(409).json({ message: "El usuario ya existe" })
            }

            const passwordHash = await bcrypt.hash(password, 10)
            const user = await UserModel.createUser({ email, name, password: passwordHash, telefono })

            res.status(201).json(user)

        } catch (e) {
            if (e.name === "ValidationError") {
                const errors = Object.values(e.errors).map(err => err.message)
                return res.status(400).json({ message: "Datos inválidos", errors })
            }
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json({ message: "email y password son requeridos" })
            }

            const userExist = await UserModel.getUser({ email })
            if (!userExist) {
                return res.status(404).json({ message: "El usuario no existe" })
            }

            const isPasswordValid = await bcrypt.compare(password, userExist.password)
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Contraseña incorrecta" })
            }

            const token = generarToken(userExist)
            res.status(200).json({ message: "Login exitoso", token })

        } catch (e) {
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async profile(req, res) {
        try {
            const data = await UserModel.getUser({ email: req.emailConectado })

            if (!data) {
                return res.status(404).json({ message: "Usuario no encontrado" })
            }

            res.status(200).json(data)

        } catch (e) {
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async updateUsers(req, res) {
        try {
            const userIdFromTokens = req.user.id
            const userIdFromParams = req.params.id

            if (userIdFromTokens !== userIdFromParams && req.user.role !== "admin") {
                return res.status(403).json({ message: "No autorizado" })
            }

            const user = await UserModel.updateUser(userIdFromParams, req.body)

            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" })
            }

            res.status(200).json(user)

        } catch (e) {
            if (e.name === "CastError") {
                return res.status(400).json({ message: "ID de usuario inválido" })
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