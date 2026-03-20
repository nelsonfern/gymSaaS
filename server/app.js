import express from 'express'
import 'dotenv/config'
import { corsMiddleware } from './helpers/cors.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'

import { clientRoutes } from './routes/client.js'
import DbClient from './config/dbClient.js'
import { userRoutes } from './routes/user.js'
import { planRoutes } from './routes/plan.js'
import { paymentsRouter } from './routes/pagos.js'
import { checkinRoutes } from './routes/checkin.js'
import { startMembershipJob } from './jobs/membershipJob.js'

const app = express()

// Seguridad HTTP
app.use(helmet())

// CORS configurado dinámicamente desde /helpers
app.use(corsMiddleware())

// Limita el JSON subido a máx 10kb (mitiga ataques DOS de payload grande)
app.use(express.json({ limit: '10kb' }))

// Limpia los JSON body, query y params para evitar Inyecciones NoSQL
app.use(mongoSanitize())

// Protección contra "Too Many Requests" (DDoS o Fuerza bruta)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones cada 15 min por IP
    message: { message: "Demasiadas peticiones a la API. Intenta nuevamente en 15 minutos." }
})

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10, // Max 10 intentos fallidos por hora
    message: { error: "Demasiados intentos de inicio de sesión. Intenta en una hora." }
})

// Aplicar límite general a todas las rutas
app.use(apiLimiter)

// Aplicar un límite MÁS estricto al login/registro para evitar fuerza bruta
app.use('/users/login', authLimiter)
app.use('/users/register', authLimiter)

app.use('/clients', clientRoutes)
app.use('/users', userRoutes)
app.use('/plans', planRoutes)
app.use('/payments', paymentsRouter)
app.use('/checkins', checkinRoutes)
startMembershipJob()
try {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
} catch (e) {
    console.log(e)
}

process.on('SIGINT', async () => {
    await DbClient.disconnectDB()
    process.exit(0)
})