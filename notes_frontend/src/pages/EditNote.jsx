import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import NoteForm from '../components/NoteForm';
import { Loader2 } from 'lucide-react';

const EditNote = () => {
    const { id } = useParams();
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (!note) {
        return <div className="text-center py-12">Note not found</div>;
    }

    return <NoteForm initialData={note} />;
};

export default EditNote;
