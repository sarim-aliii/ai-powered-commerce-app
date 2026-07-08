import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, CreditCard, PackageSearch, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState('123 React Street, Web City');
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id) {
            fetchCart();
        }
    }, [user?.id]);

    const fetchCart = async () => {
        try {
            const response = await api.get(`/carts/user/${user.id}`);
            setCart(response.data);
        } catch (err) {
            toast.error("Failed to fetch cart data");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await api.delete(`/carts/user/${user.id}/remove/${productId}`);
            toast.success('Item removed from cart');
            fetchCart();
        } catch (err) {
            toast.error('Failed to remove item');
        }
    };

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const response = await api.post('/orders/checkout', {
                userId: userId,
                shippingAddress: address
            });
            toast.success(`Order placed successfully! ID: ${response.data.id}`, { duration: 5000 });
            navigate('/products');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Checkout failed');
        } finally {
            setIsCheckingOut(false);
        }
    };

    // 1. Loading State
    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center text-gray-400 gap-4">
                <PackageSearch size={48} className="animate-pulse" />
                <p className="font-medium">Loading your cart...</p>
            </div>
        );
    }

    // 2. Empty Cart State
    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-2xl mx-auto mt-20 p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="mx-auto h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart size={40} className="text-blue-500" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet. Discover our top-tier products and start shopping.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors active:scale-95"
                >
                    Browse Products <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    // 3. Active Cart Layout
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-10">
                <ShoppingCart size={32} className="text-blue-600" />
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Cart</h1>
            </div>

            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">

                {/* Left Column: Cart Items */}
                <div className="lg:col-span-7 space-y-4">
                    {cart.items.map(item => (
                        <div key={item.id} className="flex items-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">

                            {/* Placeholder for item image if you add it to the API later */}
                            <div className="h-20 w-20 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 mr-6 flex-shrink-0">
                                <PackageSearch className="text-gray-300" size={28} />
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.productName}</h3>
                                <p className="text-sm font-medium text-gray-500">
                                    Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <span className="font-black text-xl text-gray-900">
                                    ${item.itemTotal.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => handleRemoveItem(item.productId)}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    title="Remove item"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Order Summary & Checkout */}
                <div className="lg:col-span-5 mt-10 lg:mt-0 bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-24">
                    <h2 className="text-xl font-extrabold text-gray-900 mb-6">Order Summary</h2>

                    <div className="space-y-4 text-sm font-medium text-gray-500 mb-6 border-b border-gray-200 pb-6">
                        <div className="flex justify-between">
                            <span>Subtotal ({cart.items.length} items)</span>
                            <span className="text-gray-900">${cart.cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping estimate</span>
                            <span className="text-gray-900">Calculated at checkout</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-8">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-3xl font-black text-blue-600">${cart.cartTotal.toFixed(2)}</span>
                    </div>

                    {/* Shipping Address Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Shipping Address</label>
                        <textarea
                            rows="2"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm resize-none"
                            placeholder="Enter your full shipping address..."
                        />
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className={`w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-lg font-bold text-white shadow-lg transition-all ${
                            isCheckingOut
                            ? 'bg-blue-400 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/25 active:scale-[0.98]'
                        }`}
                    >
                        <CreditCard size={20} />
                        {isCheckingOut ? 'Processing Order...' : 'Checkout Securely'}
                    </button>

                    <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-gray-500">
                        <ShieldCheck size={18} className="text-green-500" />
                        SSL Encrypted Checkout
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;