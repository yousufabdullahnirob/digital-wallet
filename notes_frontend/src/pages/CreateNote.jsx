import React from 'react';
import { Link } from 'react-router-dom';
import NoteForm from '../components/NoteForm';
import { ArrowLeft } from 'lucide-react';

const CreateNote = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition">
                <ArrowLeft size={20} className="mr-2" />
                Back to Notes
            </Link>
            <NoteForm />
        </div>
    );
};

export default CreateNote;
