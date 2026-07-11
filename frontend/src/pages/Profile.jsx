import { useState, useEffect } from 'react';
import { User, MapPin, CreditCard, Package, LogOut, Sparkles, Wallet, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('personal');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Order State
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Wallet State
    const [fundAmount, setFundAmount] = useState('');
    const [isAddingFunds, setIsAddingFunds] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/users/profile');
                setProfileData(response.data);
            } catch{
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        if (activeTab === 'orders') {
            const fetchOrders = async () => {
                setLoadingOrders(true);
                try {
                    const response = await api.get('/orders/my-orders');
                    setOrders(response.data);
                } catch{
                    toast.error("Failed to load order history");
                } finally {
                    setLoadingOrders(false);
                }
            };
            fetchOrders();
        }
    }, [activeTab]);

    // Function to handle adding funds
    const handleAddFunds = async (e) => {
        e.preventDefault();
        const amount = parseFloat(fundAmount);

        if (isNaN(amount) || amount <= 0) {
            return toast.error("Please enter a valid amount");
        }

        setIsAddingFunds(true);
        try {
            const response = await api.post('/wallet/add', { amount });
            toast.success("Funds added successfully!");

            // Instantly update the UI with the new balance from the backend
            setProfileData(prev => ({
                ...prev,
                walletBalance: response.data.newBalance
            }));
            setFundAmount(''); // Clear the input
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add funds");
        } finally {
            setIsAddingFunds(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen font-bold text-gray-500">Loading Profile...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Account</h1>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-64 flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'personal' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <User size={20} /> Personal Info
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Package size={20} /> Order History
                    </button>

                    <button
                        onClick={() => setActiveTab('wallet')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'wallet' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Wallet size={20} /> Digital Wallet
                    </button>

                    <button
                        onClick={() => setActiveTab('addresses')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'addresses' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <MapPin size={20} /> Saved Addresses
                    </button>
                    <button
                        onClick={() => setActiveTab('payment')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'payment' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <CreditCard size={20} /> Payment Methods
                    </button>

                    <div className="h-px bg-gray-200 my-4 w-full"></div>

                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>

                <div className="flex-1 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    {activeTab === 'personal' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        disabled
                                        value={profileData?.name || ''}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        disabled
                                        value={profileData?.email || ''}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>

                            {loadingOrders ? (
                                <div className="text-gray-500 font-medium">Loading orders...</div>
                            ) : orders.length === 0 ? (
                                <div className="text-gray-500">You haven't placed any orders yet.</div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div key={order.id} className="p-6 border border-gray-100 bg-gray-50 rounded-2xl">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-bold text-gray-900">Order #{order.id}</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Total: <span className="font-bold text-gray-900">${order.totalAmount?.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'wallet' && (
                        <div className="space-y-6 max-w-lg">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Digital Wallet</h2>

                            {/* Balance Card */}
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-20">
                                    <Wallet size={100} />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-gray-400 font-medium mb-1">Available Balance</p>
                                    <h3 className="text-5xl font-black tracking-tight">
                                        ${profileData?.walletBalance ? parseFloat(profileData.walletBalance).toFixed(2) : '0.00'}
                                    </h3>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mt-8">
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Top Up Wallet</h4>
                                <form onSubmit={handleAddFunds} className="flex gap-4">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-500 font-bold">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="1"
                                            required
                                            value={fundAmount}
                                            onChange={(e) => setFundAmount(e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isAddingFunds}
                                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:bg-blue-400"
                                    >
                                        <Plus size={20} />
                                        {isAddingFunds ? 'Adding...' : 'Add Funds'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {['addresses', 'payment'].includes(activeTab) && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <Sparkles className="h-8 w-8 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h3>
                            <p className="text-gray-500 max-w-sm">
                                We are currently building out the {activeTab === 'addresses' ? 'Saved Addresses' : 'Payment Methods'} feature. Check back soon!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;