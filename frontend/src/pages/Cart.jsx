import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingCart, Trash2, CreditCard, PackageSearch, ArrowRight, ShieldCheck, Tag
} from 'lucide-react';
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
        if (user?.id) fetchCart();
    }, [user?.id]);

    const fetchCart = async () => {
        try {
            const response = await api.get(`/carts/user/${user.id}`);
            setCart(response.data);
        } catch (err) {
            toast.error("Failed to fetch cart");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await api.delete(`/carts/user/${user.id}/remove/${productId}`);
            toast.success('Item removed');
            fetchCart();
        } catch (err) {
            toast.error('Failed to remove item');
        }
    };

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const response = await api.post('/orders/checkout', { userId: user.id, shippingAddress: address });
            toast.success('Order placed successfully!');
            navigate('/products');
        } catch (err) {
            toast.error('Checkout failed');
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64 text-gray-400"><PackageSearch size={48} className="animate-pulse"/></div>;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-2xl mx-auto mt-20 p-8 text-center bg-white rounded-3xl border shadow-sm">
                <ShoppingCart size={48} className="mx-auto text-blue-500 mb-6" />
                <h2 className="text-3xl font-extrabold mb-4">Your cart is empty</h2>
                <button onClick={() => navigate('/products')} className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800">Browse Products</button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-10 flex items-center gap-3">
                <ShoppingCart className="text-blue-600" size={32} /> Your Cart
            </h1>

            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-7 space-y-4">
                    {cart.items.map(item => (
                        <div key={item.id} className="flex items-center p-6 bg-white rounded-2xl border shadow-sm group">
                            <div className="h-20 w-20 bg-gray-50 rounded-xl flex items-center justify-center border mr-6">
                                <Tag className="text-gray-300" size={24} />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-lg font-bold">{item.productName}</h3>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-black text-xl">${item.itemTotal.toFixed(2)}</span>
                                <button onClick={() => handleRemoveItem(item.productId)} className="text-gray-400 hover:text-red-500 p-2">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-5 bg-gray-50 rounded-3xl p-8 border sticky top-24">
                    <h2 className="text-xl font-extrabold mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-8 border-b pb-6 text-gray-600">
                        <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-gray-900">${cart.cartTotal.toFixed(2)}</span></div>
                    </div>
                    <button onClick={handleCheckout} disabled={isCheckingOut} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700">
                        <CreditCard size={20} /> {isCheckingOut ? 'Processing...' : 'Checkout Securely'}
                    </button>
                    <p className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                        <ShieldCheck size={16} className="text-green-500" /> SSL Encrypted
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Cart;