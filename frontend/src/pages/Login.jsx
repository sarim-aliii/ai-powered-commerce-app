import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ShoppingBag, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.token);
            toast.success('Welcome back!');
            navigate('/products');
        } catch (err) {
            toast.error('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Panel - Branding (Hidden on smaller screens) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 p-12 relative overflow-hidden items-center justify-center">
                {/* Decorative background shapes */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl opacity-50"></div>
                </div>

                <div className="relative z-10 max-w-lg text-white">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
                        <Sparkles className="h-4 w-4 text-blue-200" />
                        <span className="text-sm font-medium tracking-wide text-blue-50">Commerce AI 2.0</span>
                    </div>
                    <h1 className="text-5xl font-black mb-6 leading-tight tracking-tight">
                        Manage your store with intelligent insights.
                    </h1>
                    <p className="text-lg text-blue-100 font-medium leading-relaxed">
                        Access your dashboard to track inventory, fulfill orders, and seamlessly update your product catalog.
                    </p>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-gray-50/50">
                <div className="w-full max-w-md">
                    <div className="text-center lg:text-left mb-10">
                        <div className="lg:hidden mx-auto h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-blue-200">
                            <ShoppingBag className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-sm text-gray-500 font-medium">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm hover:border-gray-300"
                                    placeholder="ali@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm hover:border-gray-300"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white shadow-lg transition-all ${
                                loading
                                ? 'bg-blue-400 cursor-not-allowed shadow-none'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/25 active:scale-[0.98]'
                            }`}
                        >
                            <LogIn className="h-5 w-5" />
                            {loading ? 'Authenticating...' : 'Sign in to Dashboard'}
                        </button>

                        {/* New Sign Up Link */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-600 font-bold hover:underline transition-all">
                                Sign up here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;