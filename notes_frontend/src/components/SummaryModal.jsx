import React, { useState, useEffect } from 'react';
import { X, Wand2, Loader2, Check } from 'lucide-react';
import api from '../api';

const SummaryModal = ({ isOpen, onClose, textToSummarize, onSummaryGenerated }) => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState('');

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSummary('');
            handleSummarize();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSummarize = async () => {
        if (!textToSummarize) return;
        setLoading(true);
        try {
            const response = await api.post('summarize/', { text: textToSummarize });
            setSummary(response.data.summary);
        } catch (error) {
            console.error('Summarize Error:', error);
            setSummary('Failed to generate summary. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = (append) => {
        onSummaryGenerated(summary, append);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Wand2 size={20} className="mr-2 text-purple-600" />
                        AI Summary
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Loader2 className="animate-spin text-purple-600 mb-3" size={32} />
                            <p className="text-gray-500 font-medium">Generating summary...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                <p className="text-gray-800 text-sm leading-relaxed">{summary}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleAccept(false)}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                                >
                                    Replace Body
                                </button>
                                <button
                                    onClick={() => handleAccept(true)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm flex items-center justify-center"
                                >
                                    <Check size={16} className="mr-1.5" />
                                    Add to Bottom
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SummaryModal;
