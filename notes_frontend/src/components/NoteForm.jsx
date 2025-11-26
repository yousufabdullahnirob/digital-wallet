import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ImageUpload from './ImageUpload';
import TagSelector from './TagSelector';
import OCRModal from './OCRModal';
import SummaryModal from './SummaryModal';
import { Save, ArrowLeft, ScanText, Sparkles, Image as ImageIcon, Palette, Bell, X } from 'lucide-react';

const COLORS = [
    { name: 'white', value: '#ffffff', border: '#e0e0e0' },
    { name: 'red', value: '#faafa8', border: '#f39f99' },
    { name: 'orange', value: '#f39f76', border: '#e5916e' },
    { name: 'yellow', value: '#fff8b8', border: '#f0ebae' },
    { name: 'green', value: '#e2f6d3', border: '#d3e5c5' },
    { name: 'teal', value: '#b4ddd3', border: '#a5ccc3' },
    { name: 'blue', value: '#d4efdf', border: '#c5e0d1' },
    { name: 'darkblue', value: '#aecbfa', border: '#9ebceb' },
    { name: 'purple', value: '#d7aefb', border: '#c8a1eb' },
    { name: 'pink', value: '#fdcfe8', border: '#edc0d9' },
    { name: 'brown', value: '#e6c9a8', border: '#d7ba99' },
    { name: 'gray', value: '#e8eaed', border: '#dadce0' },
];

const NoteForm = ({ existingNote = null }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tags, setTags] = useState([]);
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [color, setColor] = useState('white');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [reminder, setReminder] = useState('');

    const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (existingNote) {
            setTitle(existingNote.title);
            setBody(existingNote.body);
            setTags(existingNote.tags.map(t => t.name));
            setExistingImages(existingNote.images || []);
            setColor(existingNote.color || 'white');
            setReminder(existingNote.reminder || '');
        }
    }, [existingNote]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        formData.append('color', color);
        if (reminder) formData.append('reminder', reminder);

        tags.forEach(tag => formData.append('tag_names', tag));
        images.forEach(image => formData.append('uploaded_images', image));

        try {
            if (existingNote) {
                await api.put(`notes/${existingNote.id}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('notes/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/');
        } catch (error) {
            console.error('Error saving note:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOCRResult = (text) => {
        setBody(prev => prev + (prev ? '\n\n' : '') + text);
        setIsOCRModalOpen(false);
    };

    const handleSummaryResult = (summaryText, shouldAppend) => {
        setSummary(summaryText);
        if (shouldAppend) {
            setBody(prev => prev + (prev ? '\n\n' : '') + '## Summary\n' + summaryText);
        } else {
            setBody(summaryText);
        }
    };

    const currentColorObj = COLORS.find(c => c.name === color) || COLORS[0];

    return (
        <div
            className="max-w-2xl mx-auto mt-8 p-1 rounded-2xl shadow-lg transition-colors duration-300"
            style={{ backgroundColor: currentColorObj.value, borderColor: currentColorObj.border }}
        >
            <form onSubmit={handleSubmit} className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-black/5 rounded-full text-gray-600 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex gap-2">
                        {/* Color Picker Toggle */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowColorPicker(!showColorPicker)}
                                className="p-2 hover:bg-black/5 rounded-full text-gray-600 transition-colors"
                                title="Change Color"
                            >
                                <Palette size={20} />
                            </button>

                            {showColorPicker && (
                                <div className="absolute top-full right-0 mt-2 p-2 bg-white rounded-lg shadow-xl border border-gray-200 grid grid-cols-4 gap-2 z-50 w-48">
                                    {COLORS.map(c => (
                                        <button
                                            key={c.name}
                                            type="button"
                                            onClick={() => { setColor(c.name); setShowColorPicker(false); }}
                                            className={`w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform ${color === c.name ? 'ring-2 ring-blue-400' : ''}`}
                                            style={{ backgroundColor: c.value }}
                                            title={c.name}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOCRModalOpen(true)}
                            className="p-2 hover:bg-black/5 rounded-full text-gray-600 transition-colors"
                            title="Extract Text from Image"
                        >
                            <ScanText size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsSummaryModalOpen(true)}
                            className="p-2 hover:bg-black/5 rounded-full text-gray-600 transition-colors"
                            title="Summarize Note"
                        >
                            <Sparkles size={20} />
                        </button>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => document.getElementById('reminder-input').showPicker()}
                                className={`p-2 hover:bg-black/5 rounded-full transition-colors ${reminder ? 'text-blue-500' : 'text-gray-600'}`}
                                title="Set Reminder"
                            >
                                <Bell size={20} />
                            </button>
                            <input
                                id="reminder-input"
                                type="datetime-local"
                                value={reminder ? new Date(reminder).toISOString().slice(0, 16) : ''}
                                onChange={(e) => setReminder(e.target.value)}
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer -z-10"
                            />
                        </div>

                        {reminder && (
                            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100 animate-in fade-in zoom-in duration-200">
                                <span className="text-xs font-semibold">
                                    {new Date(reminder).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setReminder('')}
                                    className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                                    title="Clear Reminder"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-2xl font-medium bg-transparent border-none outline-none placeholder-gray-500 text-gray-800 mb-4"
                />

                <textarea
                    placeholder="Take a note..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={6}
                    className="w-full bg-transparent border-none outline-none placeholder-gray-500 text-gray-700 resize-none text-base leading-relaxed"
                />

                <div className="mt-4 space-y-4">
                    <TagSelector tags={tags} setTags={setTags} />
                    <ImageUpload onImagesSelected={(files) => setImages(prev => [...prev, ...files])} />
                </div>

                <div className="flex justify-end mt-8 pt-4 border-t border-black/5">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-transparent hover:bg-black/5 text-gray-800 font-medium rounded-lg transition-colors"
                    >
                        {loading ? 'Saving...' : 'Close'}
                    </button>
                </div>
            </form >

            <OCRModal
                isOpen={isOCRModalOpen}
                onClose={() => setIsOCRModalOpen(false)}
                onExtract={handleOCRResult}
            />

            <SummaryModal
                isOpen={isSummaryModalOpen}
                onClose={() => setIsSummaryModalOpen(false)}
                textToSummarize={body}
                onSummaryGenerated={handleSummaryResult}
            />
        </div >
    );
};

export default NoteForm;
