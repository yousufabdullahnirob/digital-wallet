import React, { useState } from 'react';
import { X, Upload, Loader2, FileText } from 'lucide-react';
import api from '../api';

const OCRModal = ({ isOpen, onClose, onTextExtracted }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [extractedText, setExtractedText] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setExtractedText('');
        }
    };

    const handleExtract = async () => {
        if (!selectedFile) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await api.post('ocr/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setExtractedText(response.data.text);
        } catch (error) {
            console.error('OCR Error:', error);
            alert('Failed to extract text');
        } finally {
            setLoading(false);
        }
    };

    const handleInsert = () => {
        onTextExtracted(extractedText);
        onClose();
        // Reset state
        setSelectedFile(null);
        setPreview(null);
        setExtractedText('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <FileText size={20} className="mr-2 text-blue-600" />
                        Extract Text (OCR)
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {!preview ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                            <p className="text-sm text-gray-500 font-medium">Click to upload an image</p>
                        </div>
                    ) : (
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-48">
                            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                            <button
                                onClick={() => { setPreview(null); setSelectedFile(null); setExtractedText(''); }}
                                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {extractedText && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-40 overflow-y-auto">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{extractedText}</p>
                        </div>
                    )}

                    <div className="flex gap-3 mt-4">
                        {!extractedText ? (
                            <button
                                onClick={handleExtract}
                                disabled={!selectedFile || loading}
                                className="flex-1 btn-primary flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                                Extract Text
                            </button>
                        ) : (
                            <button
                                onClick={handleInsert}
                                className="flex-1 btn-primary"
                            >
                                Insert into Note
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OCRModal;
