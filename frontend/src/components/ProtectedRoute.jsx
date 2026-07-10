import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, user, loading } = useAuth();

    console.log("ProtectedRoute check ->", {
        loading,
        isAuthenticated,
        userRoles: user?.roles,
        isAdminOnlyRoute: adminOnly
    });

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading Auth...</div>;
    }

    if (!isAuthenticated) {
        console.log("🛑 Kicked out: Not authenticated");
        return <Navigate to="/login" replace />;
    }

    if (adminOnly) {
        const isAdmin = user?.roles?.includes('ROLE_ADMIN');

        if (!isAdmin) {
            console.log("🛑 Kicked out: User is not admin. Roles found:", user?.roles);
            return <Navigate to="/products" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;