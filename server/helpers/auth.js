import 'dotenv/config'
import jwt from 'jsonwebtoken'

export function generarToken(user) {
    return jwt.sign({ email: user.email, role: user.role, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' })
}

export function generarRefreshToken(user) {
    return jwt.sign({id: user._id},
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    )
}

export function verificarToken(req, res, next) {
    // Primero intenta desde cookie httpOnly, fallback a header Bearer (Postman/dev)
    const token = req.cookies?.access_token ||
        req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
        return res.status(401).json({ error: 'Token requerido' })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ error: 'Token no válido o expirado' })
    }
}

// autorizacion por roles, admin y staff
export function authorize(roles = []) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'No autorizado' })
        }
        next()
    }
}
export function isOwnerOrAdmin(paramIdField = "id") {
    return (req, res, next) => {
        const resourceId = req.params[paramIdField]

        if (
            req.user.id !== resourceId &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                error: "No autorizado"
            })
        }

        next()
    }
}