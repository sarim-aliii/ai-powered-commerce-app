import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('jwt_token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('jwt_token');
        setToken(null);
        setUser(null);
    }, []);

    const initializeUser = useCallback((currentToken) => {
        try {
            const decoded = jwtDecode(currentToken);
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
        } catch {
            console.error("Invalid token format");
            logout();
        }
    }, [logout]);

    useEffect(() => {
        if (token) {
            initializeUser(token);
        } else {
            setUser(null);
        }
        setLoading(false);
    }, [token, initializeUser]);

    const login = (newToken) => {
        localStorage.setItem('jwt_token', newToken);
        setToken(newToken);
    };

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);