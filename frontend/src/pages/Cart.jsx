import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, CreditCard, PackageSearch } from 'lucide-react';
import api from '../services/api';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState('123 React Street, Web City'); // Default for testing
    const navigate = useNavigate();

    // In a real app, this would come from a Context or Redux store after login
    const currentUserId = 2;

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await api.get(`/carts/user/${currentUserId}`);
            setCart(response.data);
        } catch (err) {
            console.error("Failed to fetch cart", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await api.delete(`/carts/user/${currentUserId}/remove/${productId}`);
            fetchCart(); // Refresh the cart to get updated totals
        } catch (err) {
            alert('Failed to remove item');
        }
    };

    const handleCheckout = async () => {
        try {
            const response = await api.post('/orders/checkout', {
                userId: currentUserId,
                shippingAddress: address
            });
            alert(`Order placed successfully! Order ID: ${response.data.id}`);
            navigate('/products'); // Send them back to shop more
        } catch (err) {
            alert(err.response?.data?.message || 'Checkout failed');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><PackageSearch size={40} className="animate-spin" /></div>;

    if (!cart || cart.items.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', marginTop: '50px' }}>
                <ShoppingCart size={64} color="#ccc" style={{ margin: '0 auto' }} />
                <h2>Your cart is empty</h2>
                <button onClick={() => navigate('/products')} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
                    Go Shopping
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingCart size={32} /> Your Cart
            </h1>

            <div style={{ marginTop: '20px', border: '1px solid #eee', borderRadius: '8px', padding: '20px' }}>
                {cart.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0' }}>{item.productName}</h3>
                            <p style={{ margin: 0, color: '#666' }}>Quantity: {item.quantity} x ${item.unitPrice.toFixed(2)}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>${item.itemTotal.toFixed(2)}</span>
                            <button
                                onClick={() => handleRemoveItem(item.productId)}
                                style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: '5px' }}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <h2>Total: ${cart.cartTotal.toFixed(2)}</h2>
                </div>

                <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <h3>Shipping Details</h3>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{ width: '100%', padding: '10px', marginTop: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <button
                        onClick={handleCheckout}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '15px', backgroundColor: '#000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px', fontSize: '16px' }}
                    >
                        <CreditCard size={20} /> Checkout Securely
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;