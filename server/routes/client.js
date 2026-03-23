import express from 'express'
import { ClientController } from '../controllers/clients.js'
import { verificarToken, authorize } from '../helpers/auth.js'
export const clientRoutes = express.Router()

clientRoutes.get('/', verificarToken, authorize(["admin", "staff"]), ClientController.getClients)

clientRoutes.post('/', verificarToken, authorize(["admin", "staff"]), ClientController.createClient)

clientRoutes.put('/:id', verificarToken, authorize(["admin", "staff"]), ClientController.updateClient)
clientRoutes.put('/:id/plan', verificarToken, authorize(["admin", "staff"]), ClientController.updateClientPlan)

clientRoutes.get(
    "/status/:dni",
    verificarToken,
    authorize(["admin", "trainer"]),
    ClientController.getClientStatusByDni
)

clientRoutes.get('/stats', verificarToken, authorize(["admin", "staff"]), ClientController.getClientsStats)
clientRoutes.get('/byDni/:dni', verificarToken, authorize(["admin", "staff"]), ClientController.getClientByDni)
clientRoutes.get('/:id', verificarToken, authorize(["admin", "staff"]), ClientController.getClientById)

clientRoutes.delete('/:id', verificarToken, authorize(["admin"]), ClientController.deleteClient)