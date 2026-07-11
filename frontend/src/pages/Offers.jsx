import { useState, useEffect } from 'react';
import { Tag, Copy, Scissors, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Offers = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await api.get('/coupons/active');
                setCoupons(response.data);
            } catch{
                toast.error("Failed to load offers");
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        toast.success(`${code} copied to clipboard!`);
    };

    if (loading) return <div className="text-center py-20 text-gray-500 font-bold">Loading amazing deals...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-gray-900 flex justify-center items-center gap-3 mb-4">
                    <Tag className="text-blue-600" size={40} /> Exclusive Offers
                </h1>
                <p className="text-gray-500 text-lg">Grab these promo codes and save big on your next purchase!</p>
            </div>

            {coupons.length === 0 ? (
                <div className="text-center bg-gray-50 p-12 rounded-3xl border border-gray-100 flex flex-col items-center">
                    <AlertCircle size={48} className="text-gray-400 mb-4" />
                    <h2 className="text-xl font-bold text-gray-700">No active offers right now</h2>
                    <p className="text-gray-500">Check back later for seasonal discounts.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map(coupon => (
                        <div key={coupon.id} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-1 relative overflow-hidden group">
                            <div className="bg-white rounded-[22px] p-6 h-full flex flex-col justify-between relative z-10">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-blue-100 text-blue-700 font-black text-2xl px-4 py-2 rounded-xl">
                                            {coupon.discountPercentage}% OFF
                                        </div>
                                        <Scissors className="text-gray-300" size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Special Discount</h3>
                                    <p className="text-gray-500 text-sm mb-6">Valid until {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                                </div>

                                <button
                                    onClick={() => copyToClipboard(coupon.code)}
                                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-3 flex justify-between items-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer group-hover:border-blue-400"
                                >
                                    <span className="font-mono font-bold tracking-widest text-gray-700">{coupon.code}</span>
                                    <Copy size={20} className="text-gray-400 group-hover:text-blue-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Offers;