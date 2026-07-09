import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AddProductForm = ({ onClose, onRefresh }) => {
    // 1. Add image state
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        quantity: '',
        categoryId: '',
        brand: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 2. Use FormData to handle both text and files
            const data = new FormData();

            // Append the product details as a JSON Blob
            data.append('product', new Blob([JSON.stringify(formData)], {
                type: 'application/json'
            }));

            // Append the image file if it exists
            if (imageFile) {
                data.append('image', imageFile);
            }

            // 3. Send as multipart/form-data
            await api.post('/admin/products/add', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success("Product added successfully!");
            onRefresh();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add product");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl w-96 shadow-xl space-y-4">
                <h2 className="text-xl font-bold">Add New Product</h2>

                {/* 4. Add the File Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                <input required placeholder="Name" className="w-full p-2 border rounded" onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required type="number" placeholder="Price" className="w-full p-2 border rounded" onChange={e => setFormData({...formData, price: e.target.value})} />
                <input required type="number" placeholder="Quantity" className="w-full p-2 border rounded" onChange={e => setFormData({...formData, quantity: e.target.value})} />
                <input required type="number" placeholder="Category ID" className="w-full p-2 border rounded" onChange={e => setFormData({...formData, categoryId: e.target.value})} />
                <input required placeholder="Brand" className="w-full p-2 border rounded" onChange={e => setFormData({...formData, brand: e.target.value})} />
                <textarea placeholder="Description" className="w-full p-2 border rounded" onChange={e => setFormData({...formData, description: e.target.value})} />

                <div className="flex gap-2 pt-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">Save Product</button>
                    <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded w-full hover:bg-gray-300">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;