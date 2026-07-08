import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('jwt_token'));
    const [user, setUser] = useState(null); // 1. Add a state for the user data

    // 2. Automatically decode the token whenever it is set or updated
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    // Adjust this depending on what your Spring Boot backend puts in the token payload
                    id: decoded.userId || decoded.id || 2,
                    email: decoded.sub
                });
            } catch (error) {
                console.error("Invalid token format");
                logout(); // Safety mechanism to clear bad tokens
            }
        } else {
            setUser(null);
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('jwt_token', newToken);
        setToken(newToken); // This state update will trigger the useEffect to decode the token
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        setToken(null);
    };

    return (
        // 3. Expose the `user` object to the rest of the application
        <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);