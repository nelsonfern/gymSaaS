import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

export const AuthProvider = ({ children}) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token")
        return token ? { token } : null
    })

    const login = (token) =>{
        localStorage.setItem("token", token)
        setUser({token})
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }

    const value = {
        user,
        login,
        logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)