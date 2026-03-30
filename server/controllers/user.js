import { UserModel } from "../models/user.js";
import bcrypt from 'bcrypt'
import { generarToken, generarRefreshToken } from "../helpers/auth.js";
import jwt from 'jsonwebtoken'
import 'dotenv/config'

// Opciones compartidas para las cookies de tokens
const ACCESS_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutos
    path: '/'
}

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    path: '/'
}

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

            const accessToken = generarToken(userExist)
            const refreshToken = generarRefreshToken(userExist)

            await UserModel.saveRefreshToken(userExist._id, refreshToken)

            // Setear ambos tokens como cookies httpOnly
            res.cookie('access_token', accessToken, ACCESS_COOKIE_OPTIONS)
            res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS)

            // Devolver datos del usuario (sin tokens en body)
            res.status(200).json({
                message: "Login exitoso",
                user: {
                    id: userExist._id,
                    name: userExist.name,
                    email: userExist.email,
                    role: userExist.role,
                }
            })

        } catch (e) {
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }

    static async profile(req, res) {
        try {
            const data = await UserModel.getUserById(req.user.id)

            if (!data) {
                return res.status(404).json({ message: "Usuario no encontrado" })
            }

            res.status(200).json({
                id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
            })

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

    static async refreshToken(req, res) {
        try {
            // Leer refresh token desde cookie (o body como fallback para Postman)
            const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken

            if (!refreshToken) {
                return res.status(401).json({ message: "Refresh token requerido" })
            }

            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

            const user = await UserModel.getUserById(decoded.id)

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(403).json({ message: "Token inválido" })
            }

            const newAccessToken = generarToken(user)

            // Rotar también el access token en cookie
            res.cookie('access_token', newAccessToken, ACCESS_COOKIE_OPTIONS)

            res.json({ message: "Token renovado" })

        } catch (error) {
            return res.status(403).json({ message: "Token inválido o expirado" })
        }
    }

    static async logout(req, res) {
        try {
            const userId = req.user.id

            await UserModel.removeRefreshToken(userId)

            // Limpiar ambas cookies
            res.clearCookie('access_token', { path: '/' })
            res.clearCookie('refresh_token', { path: '/' })

            res.json({ message: "Logout exitoso" })

        } catch (e) {
            res.status(500).json({ message: "Error interno" })
        }
    }
    static async createStaff(req, res){
        try {
            if(req.user.role !== "admin"){
                return res.status(403).json({ message: "No autorizado" })
            }
            const {name, email, password} = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
        
            const newStaff = await UserModel.createUser({name, email, password: hashedPassword, role: "staff"})
            res.status(201).json({message: "Staff creado exitosamente"})
            } catch (e) {
                if (e.name === "ValidationError") {
                    const errors = Object.values(e.errors).map(err => err.message)
                    return res.status(400).json({ message: "Datos inválidos", errors })
                }
                console.error(e)
                res.status(500).json({ message: "Error interno del servidor" })
            }
    }
    static async getStaff(req, res){
        try {
            if(req.user.role !== "admin"){
                return res.status(403).json({ message: "No autorizado" })
            }
            const staff = await UserModel.getStaff()
            res.status(200).json(staff)
        } catch (e) {
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }
    static async updateStaff(req, res){
        try {
            if(req.user.role !== "admin"){
                return res.status(403).json({ message: "No autorizado" })
            }
            const {name, email, password} = req.body;
            let updateData = { name, email };
            if (password && password.trim() !== "") {
                updateData.password = await bcrypt.hash(password, 10);
            }
            const staff = await UserModel.updateUser(req.params.id, updateData)
            if(!staff){
                return res.status(404).json({ message: "Staff no encontrado" })
            }
            
            res.status(200).json({message: "Staff actualizado exitosamente"})
        } catch (e) {
            if (e.name === "ValidationError") {
                const errors = Object.values(e.errors).map(err => err.message)
                return res.status(400).json({ message: "Datos inválidos", errors })
            }
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }
    static async deleteStaff(req, res){
        try {
            if(req.user.role !== "admin"){
                return res.status(403).json({ message: "No autorizado" })
            }
            const staff = await UserModel.deleteUser(req.params.id)
            res.status(200).json({message: "Staff eliminado exitosamente"})
        } catch (e) {
            console.error(e)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }
}
