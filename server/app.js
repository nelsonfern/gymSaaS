import express from 'express'
import 'dotenv/config'
import { clientRoutes } from './routes/client.js'
import DbClient from './config/dbClient.js'
import { userRoutes } from './routes/user.js'
import { planRoutes } from './routes/plan.js'
import { paymentsRouter } from './routes/pagos.js'
import { startMembershipJob } from './jobs/membershipJob.js'
const app = express()
app.use(express.json())
app.use('/clients', clientRoutes)
app.use('/users', userRoutes)
app.use('/plans', planRoutes)
app.use('/payments', paymentsRouter)
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