import { Router } from "express"
import { PaymentController } from "../controllers/pago.js"
import { verificarToken, authorize } from "../helpers/auth.js"

export const paymentsRouter = Router()

paymentsRouter.post(
    "/",
    verificarToken,
    authorize(["admin", "staff"]),
    PaymentController.createPayment
)

// 🔥 Obtener todos los pagos (admin)
paymentsRouter.get(
    "/",
    verificarToken,
    authorize(["admin", "staff"]),
    PaymentController.getPayments
)

// 🔥 Obtener pagos por cliente (admin y trainer)
paymentsRouter.get(
    "/client/:clientId",
    verificarToken,
    authorize(["admin", "staff"]),
    PaymentController.getPaymentsByClient
)

