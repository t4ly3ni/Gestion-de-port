import { createContext, use, useState, useContext } from "react";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("pos-user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            return parsedUser.role === 'agent' || parsedUser.role === 'admin' ? parsedUser : null;
        }
        return null;
    });

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem("pos-user", JSON.stringify(userData));
        localStorage.setItem("pos-token", token);
    }
    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
        } catch (e) {
            // Ignore errors, just clear local state
        }
        setUser(null);
        localStorage.removeItem("pos-user");
        localStorage.removeItem("pos-token");
    }
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;