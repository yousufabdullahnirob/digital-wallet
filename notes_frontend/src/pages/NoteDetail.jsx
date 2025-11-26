import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, Trash2, Tag, Calendar, Loader2 } from 'lucide-react';

const NoteDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await api.get(`notes/${id}/`);
                setNote(response.data);
            } catch (error) {
                console.error('Error fetching note:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this note?')) {
            try {
                await api.delete(`notes/${id}/`);
                navigate('/');
            } catch (error) {
                console.error('Error deleting note:', error);
                alert('Failed to delete note');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (!note) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p className="text-gray-500 mb-4 text-xl">Note not found</p>
                <Link to="/" className="text-blue-600 hover:underline font-medium">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Notes
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            to={`/edit/${id}`}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                            title="Delete Note"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {note.images && note.images.length > 0 && (
                        <div className="w-full h-96 bg-gray-100 border-b border-gray-100">
                            <img
                                src={note.images[0].image_url}
                                alt={note.title}
                                className="w-full h-full object-contain p-4"
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-10">
                        <div className="mb-8 border-b border-gray-100 pb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{note.title}</h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <Calendar size={16} className="mr-2 text-gray-400" />
                                    {new Date(note.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                {note.tags && note.tags.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        {note.tags.map(tag => (
                                            <span key={tag.id} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                                                <Tag size={12} className="mr-1.5" />
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {note.body}
                        </div>

                        {note.images && note.images.length > 1 && (
                            <div className="mt-12 pt-10 border-t border-gray-100">
                                <h3 className="text-xl font-bold mb-6 text-gray-900">Gallery</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {note.images.slice(1).map(img => (
                                        <div key={img.id} className="rounded-lg overflow-hidden h-40 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                                            <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteDetail;
