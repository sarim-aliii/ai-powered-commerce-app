import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('jwt_token');

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-8 w-8 text-blue-600" />
                        <span className="font-bold text-xl tracking-tight text-gray-900">Commerce AI</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/products" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                            Products
                        </Link>

                        <Link to="/cart" className="text-gray-500 hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
                            <ShoppingCart className="h-5 w-5" />
                            <span>Cart</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;