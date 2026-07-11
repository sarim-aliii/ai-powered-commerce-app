import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle } from 'lucide-react';
import api from '../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = 2;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get(`/orders/user/${currentUserId}`);
                const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading your history...</div>;

    if (orders.length === 0) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>You haven't placed any orders yet!</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <Package size={32} /> Order History
            </h1>

            {orders.map(order => (
                <div key={order.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginTop: '20px', backgroundColor: '#fdfdfd' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ fontWeight: 'bold', color: '#555' }}>Order #{order.id}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: order.status === 'PENDING' ? '#f59e0b' : '#10b981' }}>
                            {order.status === 'PENDING' ? <Clock size={16} /> : <CheckCircle size={16} />}
                            {order.status}
                        </span>
                    </div>

                    <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '15px 0', margin: '15px 0' }}>
                        {order.items.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
                                <span>{item.quantity}x {item.productName}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>
                        Total: ${order.totalAmount.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
                        Shipped to: {order.shippingAddress}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Orders;