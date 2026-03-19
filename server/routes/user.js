import express from 'express'
import { UserController } from '../controllers/user.js'
import { verificarToken, isOwnerOrAdmin } from '../helpers/auth.js'
export const userRoutes = express.Router()

userRoutes.post('/register', UserController.register)
userRoutes.post('/login', UserController.login)
userRoutes.get('/profile', verificarToken, UserController.profile)
userRoutes.put('/update/:id', verificarToken, isOwnerOrAdmin(), UserController.updateUsers)

