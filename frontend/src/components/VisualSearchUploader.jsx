import React, { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const VisualSearchUploader = ({ onSearchResults }) => {
    const [searching, setSearching] = useState(false);

    const handleImageSearch = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file');
            return;
        }

        setSearching(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Using the correct endpoint that fixed the 404
            const response = await api.post('/products/search/visual', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Found similar products!');
            onSearchResults(response.data);
        } catch (err) {
            console.error(err);
            toast.error('Visual search failed. Please try again.');
        } finally {
            setSearching(false);
            // Reset the hidden input so the user can search with the exact same image again if needed
            e.target.value = null;
        }
    };

    return (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <label className={`p-2 rounded-full cursor-pointer transition-colors ${
                searching ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
            }`}>
                {searching ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Camera className="h-5 w-5" />
                )}
                <input
                    type="file"
                    className="hidden"
                    onChange={handleImageSearch}
                    disabled={searching}
                    accept="image/*"
                    title="Search by image"
                />
            </label>
        </div>
    );
};

export default VisualSearchUploader;