import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

const ImageUpload = ({ onImagesSelected }) => {
    const [previews, setPreviews] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        onImagesSelected(files);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        // Note: This logic needs to be synced with parent state in a real app if we want to remove specific files
        // For simplicity in this MVP, we just clear previews or would need a more complex state management
        // to remove specific files from the FileList (which isn't directly editable).
        // So for now, we'll just support adding.
        // A better approach is to lift state up completely.
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    </div>
                    <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
                </label>
            </div>

            {previews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {previews.map((src, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                            <img src={src} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
