import React, { useState } from 'react';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const ImageUploader = ({ productId, onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation: Only allow images
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Send the FormData to your backend endpoint
            await api.post(`/api/products/${productId}/image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Image uploaded successfully!');
            onUploadSuccess(); // Call this to refresh your product list
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative">
            <label className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all ${
                uploading ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-blue-500 hover:text-blue-600'
            }`}>
                {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Upload className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                    {uploading ? 'Uploading...' : 'Upload Image'}
                </span>
                <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                    accept="image/*"
                />
            </label>
        </div>
    );
};

export default ImageUploader;