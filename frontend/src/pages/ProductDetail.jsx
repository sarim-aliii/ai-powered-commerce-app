import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, PackageSearch, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (err) {
                toast.error('Failed to load product details');
                navigate('/products'); // Redirect back if not found
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const addToCart = async () => {
        setAddingToCart(true);
        try {
            await api.post(`/carts/user/2/add`, { productId: product.id, quantity: 1 });
            toast.success('Added to cart!');
        } catch (err) {
            toast.error('Could not add item.');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <PackageSearch size={48} className="animate-pulse text-gray-400" />
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back Button */}
            <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back to Products</span>
            </button>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">

                    {/* Left Column: Image */}
                    <div className="h-96 md:h-auto bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <PackageSearch size={80} className="text-gray-300" />
                        )}
                    </div>

                    {/* Right Column: Details */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <span className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">
                            {product.brand}
                        </span>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            {product.name}
                        </h1>

                        <div className="text-3xl font-black text-gray-900 mb-6">
                            ${product.price.toFixed(2)}
                        </div>

                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Badges */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8 border-y border-gray-100 py-6">
                            <div className="flex items-center gap-2 text-gray-600">
                                <ShieldCheck className="text-green-500" size={24} />
                                <span className="font-medium">1 Year Warranty</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Truck className="text-blue-500" size={24} />
                                <span className="font-medium">Free Fast Delivery</span>
                            </div>
                        </div>

                        <button
                            onClick={addToCart}
                            disabled={addingToCart}
                            className={`w-full sm:w-auto flex justify-center items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                                addingToCart
                                ? 'bg-blue-100 text-blue-500 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-gray-800 active:scale-[0.98] shadow-md hover:shadow-xl'
                            }`}
                        >
                            <ShoppingCart size={24} />
                            {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;