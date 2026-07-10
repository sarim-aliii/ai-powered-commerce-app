import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, LogOut, Package, User, Tag, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

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

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo Section */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/products')}>
                        <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                            <ShoppingBag className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
                            Commerce<span className="text-blue-600">AI</span>
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-2">
                        <Link to="/products" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/products') && !isActive('/products/') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
                            <Package className="h-5 w-5" /> Products
                        </Link>
                        <Link to="/cart" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/cart') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
                            <ShoppingCart className="h-5 w-5" /> Cart
                        </Link>
                        <Link to="/offers" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/offers') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
                            <Tag className="h-5 w-5" /> Offers
                        </Link>
                        <Link to="/faq" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/faq') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
                            <HelpCircle className="h-5 w-5" /> FAQs
                        </Link>
                    </div>

                    {/* Right side Actions */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <Link to="/profile" className="hidden sm:flex items-center gap-3 pr-4 border-r border-gray-200 dark:border-gray-700 cursor-pointer group">
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    {user?.email || 'User'}
                                </span>
                            </div>
                            <div className="h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                <User className="h-5 w-5 text-gray-500" />
                            </div>
                        </Link>

                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all">
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;