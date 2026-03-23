import { Router } from "express"
import { PaymentController } from "../controllers/pago.js"
import { verificarToken, authorize } from "../helpers/auth.js"

export const paymentsRouter = Router()

paymentsRouter.get(
    "/total",
    verificarToken,
    authorize(["admin", "staff"]),
    PaymentController.getTotalPayments
)

paymentsRouter.post(
    "/",
    verificarToken,
    authorize(["admin", "staff"]),
    PaymentController.createPayment
)

//  Obtener todos los pagos cualquiera puede verlos, para cargar a una table
paymentsRouter.get(
    "/",
    verificarToken,
    authorize(["admin", "staff"]),
    PaymentController.getPayments
)

//  Obtener pagos por cliente (admin y trainer)
paymentsRouter.get(
    "/client/:clientId",
    verificarToken,
    authorize(["admin", "staff"]),
    PaymentController.getPaymentsByClient
)

