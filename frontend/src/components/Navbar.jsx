import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, LogOut, Package, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Hide the navbar entirely if the user is on the login page
    if (location.pathname === '/login') return null;

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    // Helper function to check which route is active
    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo Section */}
                    <div
                        className="flex-shrink-0 flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/products')}
                    >
                        <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                            <ShoppingBag className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-gray-900">
                            Commerce<span className="text-blue-600">AI</span>
                        </span>
                    </div>

                    {/* Navigation Links (Desktop) */}
                    <div className="hidden md:flex space-x-2">
                        <Link
                            to="/products"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                isActive('/products') && !isActive('/products/')
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <Package className="h-4 w-4" />
                            Products
                        </Link>
                        <Link
                            to="/cart"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                isActive('/cart')
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Cart
                            {/* Static badge for now - we can hook this up to a CartContext later */}
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-full ml-1">
                                3
                            </span>
                        </Link>
                    </div>

                    {/* Right side - User Profile & Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-gray-200">
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                                <User className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="text-sm font-bold text-gray-700">Admin</span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Sign out</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;