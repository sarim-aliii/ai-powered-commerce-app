import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('jwt_token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);

                console.log("Decoded JWT Token:", decoded);

                let rawRoles = decoded.roles || decoded.role || [];
                if (!Array.isArray(rawRoles)) {
                    rawRoles = [rawRoles];
                }

                const normalizedRoles = rawRoles.map(r =>
                    r.startsWith('ROLE_') ? r : `ROLE_${r}`
                );

                setUser({
                    id: decoded.userId || decoded.id,
                    email: decoded.sub,
                    roles: normalizedRoles
                });
            } catch (error) {
                console.error("Invalid token format");
                logout();
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('jwt_token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);