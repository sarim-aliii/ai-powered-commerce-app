import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, List, Trash2, Plus } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import AddProductForm from '../components/AddProductForm';
import EditProductForm from '../components/EditProductForm';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [showAddModal, setShowAddModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchAdminData = async () => {
        try {
            if (activeTab === 'orders') {
                const res = await api.get('/admin/orders');
                setOrders(res.data);
            } else if (activeTab === 'products') {
                const res = await api.get('/admin/products');
                setProducts(res.data);
            } else if (activeTab === 'categories') {
                const res = await api.get('/admin/categories'); // Fetch categories here
                setCategories(res.data);
            }
        } catch (err) {
            toast.error("Failed to load data");
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, [activeTab]);

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/admin/products/${productId}`);
                toast.success("Product deleted");
                fetchAdminData();
            } catch (err) {
                toast.error("Failed to delete");
            }
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/categories', newCategory);
            toast.success("Category added successfully!");
            setNewCategory({ name: '', description: '' }); // Clear the form
            fetchAdminData(); // Refresh the list
        } catch (err) {
            toast.error("Failed to add category");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 relative">
            <h1 className="text-3xl font-extrabold mb-8">Admin Control Panel</h1>

            {/* Admin Tabs */}
            <div className="flex gap-4 mb-8">
                {['orders', 'products', 'categories'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-lg font-bold capitalize ${
                            activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Dashboard Content */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <table className="w-full text-left">
                        {/* ... your existing orders table code ... */}
                    </table>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="space-y-4">
                        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <Plus size={18} /> Add New Product
                        </button>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-4">Image</th>
                                    <th className="pb-4">Name</th>
                                    <th className="pb-4">Brand</th>
                                    <th className="pb-4">Price</th>
                                    <th className="pb-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id} className="border-b">
                                        <td className="p-4">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 shadow-sm">
                                                    No Img
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 font-medium">{product.name}</td>
                                        <td className="py-4 text-gray-500">{product.brand}</td>
                                        <td className="py-4">${product.price.toFixed(2)}</td>
                                        <td className="py-4">
                                            <button onClick={() => setEditingProduct(product)}
                                                    className="text-blue-500 hover:text-blue-700 font-medium"
                                                >
                                                    Edit
                                                </button>
                                            <button onClick={() => handleDelete(product.id)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors p-2">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="space-y-8">
                        <form onSubmit={handleAddCategory} className="flex gap-4 items-end bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
                                <input
                                    required
                                    value={newCategory.name}
                                    onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g., Electronics"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <input
                                    value={newCategory.description}
                                    onChange={e => setNewCategory({...newCategory, description: e.target.value})}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Optional description"
                                />
                            </div>
                            <button type="submit" className="bg-green-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors font-medium">
                                <Plus size={18} /> Add Category
                            </button>
                        </form>

                        {/* Categories Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b text-gray-600">
                                        <th className="pb-4 font-semibold">ID</th>
                                        <th className="pb-4 font-semibold">Name</th>
                                        <th className="pb-4 font-semibold">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(category => (
                                        <tr key={category.id} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="py-4 text-gray-500">#{category.id}</td>
                                            <td className="py-4 font-bold text-gray-800">{category.name}</td>
                                            <td className="py-4 text-gray-600">{category.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {categories.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No categories found. Add one above!
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {showAddModal && (
                <AddProductForm
                    onClose={() => setShowAddModal(false)}
                    onRefresh={fetchAdminData}
                />
            )}

            {editingProduct && (
                <EditProductForm
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onRefresh={fetchAdminData}
                />
            )}
        </div>
    );
};

export default AdminDashboard;