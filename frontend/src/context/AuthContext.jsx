import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('jwt_token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Define logout using useCallback so it's stable and can be used in effects/dependencies
    const logout = useCallback(() => {
        localStorage.removeItem('jwt_token');
        setToken(null);
        setUser(null);
    }, []);

    // 2. Define user initialization logic
    const initializeUser = useCallback((token) => {
        try {
            const decoded = jwtDecode(token);
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
            logout(); // Now this is safely defined
        }
    }, [logout]);

    // 3. Only the effect runs the logic
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

export const useAuth = () => useContext(AuthContext);