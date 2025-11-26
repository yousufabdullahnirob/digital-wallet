import React from 'react';
import { Link } from 'react-router-dom';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Bell } from 'lucide-react';

const COLORS = {
    white: 'var(--color-white)',
    red: 'var(--color-red)',
    orange: 'var(--color-orange)',
    yellow: 'var(--color-yellow)',
    green: 'var(--color-green)',
    teal: 'var(--color-teal)',
    blue: 'var(--color-blue)',
    darkblue: 'var(--color-darkblue)',
    purple: 'var(--color-purple)',
    pink: 'var(--color-pink)',
    brown: 'var(--color-brown)',
    gray: 'var(--color-gray)',
};

const NoteCard = ({ note }) => {
    const bgColor = COLORS[note.color] || COLORS.white;
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `note-${note.id}`,
        data: { type: 'note', note }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        backgroundColor: bgColor,
        touchAction: 'none'
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <Link
                to={`/notes/${note.id}`}
                className="block card overflow-hidden group h-full flex flex-col relative border border-[var(--border-color)] hover:border-[var(--text-secondary)]/30"
                style={{ backgroundColor: 'inherit' }}
            >
                {note.images && note.images.length > 0 && (
                    <div className="w-full h-48 overflow-hidden relative">
                        <img
                            src={note.images[0].image_url}
                            alt={note.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </div>
                )}

                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-[17px] font-bold text-[var(--text-primary)] mb-2 leading-tight tracking-tight">
                        {note.title}
                    </h3>

                    <p className="text-[var(--text-secondary)] text-[15px] line-clamp-4 mb-4 leading-relaxed flex-grow font-normal">
                        {note.body}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex flex-wrap gap-1.5">
                            {note.tags && note.tags.slice(0, 3).map(tag => (
                                <span key={tag.id} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/5 text-[var(--text-primary)]/70 uppercase tracking-wide">
                                    {tag.name}
                                </span>
                            ))}
                            {note.tags && note.tags.length > 3 && (
                                <span className="text-[11px] text-[var(--text-secondary)] font-medium">+{note.tags.length - 3}</span>
                            )}
                        </div>
                        {note.reminder && (
                            <div className="flex items-center gap-1 text-[var(--text-secondary)] bg-black/5 px-2 py-0.5 rounded-md" title={`Reminder: ${new Date(note.reminder).toLocaleString()}`}>
                                <Bell size={12} />
                                <span className="text-[10px] font-medium">
                                    {new Date(note.reminder).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    {' '}
                                    {new Date(note.reminder).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default NoteCard;


