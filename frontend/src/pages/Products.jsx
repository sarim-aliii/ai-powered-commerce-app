import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, PackageSearch, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
import VisualSearchUploader from '../components/VisualSearchUploader';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        // Initial fetch
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (err) {
                toast.error('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Debounced search function
    const fetchSearchResults = useCallback(
        debounce(async (query) => {
            try {
                const endpoint = query.trim() ? `/products/search?query=${query}` : '/products';
                const response = await api.get(endpoint);
                setProducts(response.data);
            } catch (err) {
                toast.error('Search failed');
            }
        }, 300),
        []
    );

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        fetchSearchResults(value);
    };

    const addToCart = async (productId) => {
        if (!user || !user.id) {
            toast.error("Please log in to add items to your cart.");
            return;
        }

        setAddingToCart(productId);
        try {
            await api.post(`/carts/user/${user.id}/add`, { productId, quantity: 1 });
            toast.success('Added to cart!');
        } catch (err) {
            toast.error('Could not add item.');
        } finally {
            setAddingToCart(null);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">New Arrivals</h1>
                <SkeletonLoader count={8} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
                />

                <VisualSearchUploader
                    onSearchResults={(matchedProducts) => {
                        setProducts(matchedProducts);
                    }}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div
                        key={product.id}
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col cursor-pointer"
                    >
                        <div className="h-48 bg-gray-50 flex items-center justify-center border-b border-gray-100 overflow-hidden relative">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            ) : (
                                <PackageSearch size={40} className="text-gray-300" />
                            )}
                        </div>

                        <div className="p-5 flex-grow flex flex-col">
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                                {product.brand || 'Generic'}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                                {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 flex-grow mb-4 line-clamp-2">
                                {product.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                <span className="text-xl font-black text-gray-900">
                                    ${product.price ? product.price.toFixed(2) : '0.00'}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(product.id);
                                    }}
                                    disabled={addingToCart === product.id}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                        addingToCart === product.id
                                        ? 'bg-blue-100 text-blue-500 cursor-not-allowed'
                                        : 'bg-black text-white hover:bg-gray-800 active:scale-95'
                                    }`}
                                >
                                    <ShoppingCart size={18} />
                                    {addingToCart === product.id ? 'Adding...' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State for Search */}
            {products.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    No products found.
                </div>
            )}
        </div>
    );
};

export default Products;