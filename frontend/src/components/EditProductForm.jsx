import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const EditProductForm = ({ product, onClose, onRefresh }) => {
    // Pre-fill the state with the product's existing details
    const [formData, setFormData] = useState({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        quantity: product.quantity || '',
        categoryId: product.categoryId || '',
        brand: product.brand || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send a PUT request to the new Admin endpoint
            await api.put(`/admin/products/${product.id}`, formData);
            toast.success("Product updated successfully!");
            onRefresh();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update product");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl w-96 shadow-xl space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>

                <div>
                    <label className="text-xs text-gray-500">Name</label>
                    <input required value={formData.name} className="w-full p-2 border rounded" onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="flex gap-2">
                    <div className="w-1/2">
                        <label className="text-xs text-gray-500">Price</label>
                        <input required type="number" value={formData.price} className="w-full p-2 border rounded" onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div className="w-1/2">
                        <label className="text-xs text-gray-500">Quantity</label>
                        <input required type="number" value={formData.quantity} className="w-full p-2 border rounded" onChange={e => setFormData({...formData, quantity: e.target.value})} />
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="w-1/2">
                        <label className="text-xs text-gray-500">Category ID</label>
                        <input required type="number" value={formData.categoryId} className="w-full p-2 border rounded" onChange={e => setFormData({...formData, categoryId: e.target.value})} />
                    </div>
                    <div className="w-1/2">
                        <label className="text-xs text-gray-500">Brand</label>
                        <input required value={formData.brand} className="w-full p-2 border rounded" onChange={e => setFormData({...formData, brand: e.target.value})} />
                    </div>
                </div>

                <div>
                    <label className="text-xs text-gray-500">Description</label>
                    <textarea value={formData.description} className="w-full p-2 border rounded" onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="flex gap-2 pt-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition">Update</button>
                    <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded w-full hover:bg-gray-300 transition">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditProductForm;