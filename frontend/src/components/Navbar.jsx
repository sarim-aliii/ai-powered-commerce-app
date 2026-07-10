import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, LogOut, Package, User, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    if (location.pathname === '/login' || location.pathname === '/signup') return null;

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const isActive = (path) => location.pathname.startsWith(path);
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo Section */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/products')}>
                        <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                            <ShoppingBag className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-gray-900">
                            Commerce<span className="text-blue-600">AI</span>
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-2">
                        <Link to="/products" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/products') && !isActive('/products/') ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900'}`}>
                            <Package className="h-5 w-5" /> Products
                        </Link>
                        <Link to="/cart" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/cart') ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900'}`}>
                            <ShoppingCart className="h-5 w-5" /> Cart
                        </Link>

                        {/* Conditionally render Admin link if user has ROLE_ADMIN */}
                        {isAdmin && (
                            <Link to="/admin" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/admin') ? 'bg-purple-50 text-purple-700' : 'text-gray-500 hover:text-purple-600'}`}>
                                <ShieldCheck className="h-5 w-5" /> Admin Panel
                            </Link>
                        )}
                    </div>

                    {/* Right side Actions */}
                    <div className="flex items-center gap-4">

                        {/* ✨ NEW: Wrapped the user details in a Link to /profile with hover effects */}
                        <Link
                            to="/profile"
                            className="hidden sm:flex items-center gap-3 pr-4 border-r border-gray-200 cursor-pointer group"
                        >
                            <div className="flex flex-col items-end">
                                {/* Display the user's email */}
                                <span className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {user?.email || 'User'}
                                </span>
                                {isAdmin && <span className="text-[10px] font-black tracking-wider text-purple-600 uppercase">Admin</span>}
                            </div>
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                                <User className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                            </div>
                        </Link>

                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all">
                            <LogOut className="h-5 w-5" />
                            <span className="hidden sm:inline">Sign out</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;