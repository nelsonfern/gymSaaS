import express from 'express'
import { UserController } from '../controllers/user.js'
import { verificarToken, isOwnerOrAdmin, authorize } from '../helpers/auth.js'
export const userRoutes = express.Router()

userRoutes.post('/register', UserController.register)
userRoutes.post('/login', UserController.login)
userRoutes.get('/profile', verificarToken, UserController.profile)
userRoutes.put('/update/:id', verificarToken, isOwnerOrAdmin(), UserController.updateUsers)
userRoutes.post('/refresh', UserController.refreshToken)   // público — valida refresh_token desde cookie
userRoutes.post('/logout', verificarToken, UserController.logout)
userRoutes.get('/staff', verificarToken, authorize(['admin']), UserController.getStaff)
userRoutes.post("/staff", verificarToken, authorize(["admin"]), UserController.createStaff)
userRoutes.put("/staff/:id", verificarToken, authorize(["admin"]), UserController.updateStaff)
userRoutes.delete("/staff/:id", verificarToken, authorize(["admin"]), UserController.deleteStaff)