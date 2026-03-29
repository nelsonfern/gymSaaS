import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoutes({ children }) {
    const { user, loading } = useAuth()

    // Mientras se verifica la cookie con el servidor, no redirigir todavía
    if (loading) {
        return null // o un spinner si querés
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}