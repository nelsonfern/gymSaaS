import { UserModel } from "../models/user.js";
import bcrypt from 'bcrypt'
import { generarToken } from "../helpers/auth.js";



export class UserController {
    constructor() { }

    static async register(req, res) {
        try {
            const { email, name, password, telefono } = req.body
            const userExiste = await UserModel.getUser({ email })
            if (userExiste) {
                return res.status(400).json({ error: 'El usuario ya existe' })
            }
            const passwordHash = await bcrypt.hash(password, 10)

            const user = await UserModel.createUser({ email, name, password: passwordHash, telefono })
            res.status(201).json(user)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body
            const userExist = await UserModel.getUser({ email })
            if (!userExist) {
                return res.status(400).json({ error: 'El usuario no existe' })
            }
            const isPasswordValid = await bcrypt.compare(password, userExist.password)
            if (!isPasswordValid) {
                return res.status(400).json({ error: 'Contraseña incorrecta' })
            }
            const token = generarToken(userExist)
            res.status(200).json({ message: 'Login exitoso', token })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static async profile(req, res) {
        try {
            const data = await UserModel.getUser({ email: req.emailConectado })
            res.status(200).json(data)
        } catch (e) {
            res.status(500).json({ message: "Internal server error" })
        }
    }

    static async updateUsers(req, res) {
        try {
            const userIdFromTokens = req.user.id
            const userIdFromParams = req.params.id
            //regla clave 
            if (userIdFromTokens !== userIdFromParams && req.user.role !== "admin") {
                return res.status(403).json({ error: 'No autorizado' })
            }
            const user = await UserModel.updateUser(userIdFromParams, req.body)
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}